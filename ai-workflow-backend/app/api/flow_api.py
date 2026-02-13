"""Flow API endpoints."""
import logging
import asyncio
import json
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.models import Flow, FlowRun, RunStatus, get_db
from app.services.flow_executor import flow_executor
from app.services.python_exporter_service import python_exporter_service
from app.services.ghost_recorder_service import ghost_recorder_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["flows"])


# Pydantic schemas
class FlowCreate(BaseModel):
    name: str
    description: str = ""
    flow_data: dict


class FlowResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = ""
    flow_data: dict
    share_token: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class FlowRunRequest(BaseModel):
    flow_data: dict
    input: str


class FlowRunResponse(BaseModel):
    output: str
    logs: List[dict] = []


class FlowRunHistoryResponse(BaseModel):
    id: int
    input_message: str
    output_result: str
    status: str
    execution_logs: List[dict] = []
    created_at: datetime
    
    class Config:
        from_attributes = True


# Endpoints
# Endpoints
@router.post("/flow/save", response_model=FlowResponse)
async def save_flow(flow: FlowCreate, db: Session = Depends(get_db)):
    """Save a new flow to the database."""
    try:
        # Check if flow name already exists
        existing_flow = db.query(Flow).filter(Flow.name == flow.name).first()
        if existing_flow:
            raise HTTPException(status_code=400, detail="Flow name already exists")
            
        db_flow = Flow(
            name=flow.name,
            description=flow.description,
            flow_data=flow.flow_data,
            share_token=str(uuid.uuid4())[:8] # Generate a short unique token
        )
        db.add(db_flow)
        db.commit()
        db.refresh(db_flow)
        
        logger.info(f"Flow saved: {db_flow.id}")
        return db_flow
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving flow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/flow/{flow_id}", response_model=FlowResponse)
async def update_flow(flow_id: int, flow: FlowCreate, db: Session = Depends(get_db)):
    """Update an existing flow."""
    try:
        db_flow = db.query(Flow).filter(Flow.id == flow_id).first()
        if not db_flow:
            raise HTTPException(status_code=404, detail="Flow not found")
        
        # Check if new name exists in ANOTHER flow
        if db_flow.name != flow.name:
            existing_name = db.query(Flow).filter(Flow.name == flow.name, Flow.id != flow_id).first()
            if existing_name:
                raise HTTPException(status_code=400, detail="Flow name already exists")
        
        db_flow.name = flow.name
        db_flow.description = flow.description
        db_flow.flow_data = flow.flow_data
        db_flow.updated_at = datetime.now()
        
        db.commit()
        db.refresh(db_flow)
        
        logger.info(f"Flow updated: {db_flow.id}")
        return db_flow
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating flow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/flow/{flow_id}")
async def delete_flow(flow_id: int, db: Session = Depends(get_db)):
    """Delete a flow from the database."""
    try:
        db_flow = db.query(Flow).filter(Flow.id == flow_id).first()
        if not db_flow:
            raise HTTPException(status_code=404, detail="Flow not found")
        
        db.delete(db_flow)
        db.commit()
        
        logger.info(f"Flow deleted: {flow_id}")
        return {"status": "success", "message": f"Flow {flow_id} deleted"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting flow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/flow/run")
async def run_flow(request: FlowRunRequest, db: Session = Depends(get_db)):
    """Execute a flow with streaming progress."""
    try:
        # Create flow run record
        flow_run = FlowRun(
            input_message=request.input,
            status=RunStatus.RUNNING
        )
        db.add(flow_run)
        db.commit()
        
        logger.info(f"Starting streaming flow execution: {flow_run.id}")

        async def event_generator():
            final_result = None
            try:
                async for event_json in flow_executor.execute(request.flow_data, request.input):
                    import json
                    event = json.loads(event_json)
                    if event["type"] == "final":
                        final_result = event
                    
                    # Yield SSE formatted data
                    yield f"data: {event_json}\n\n"
                
                # Update DB after completion
                if final_result:
                    # Get fresh DB session since the original one might be closed or not thread-safe for async generator closure
                    from app.models import SessionLocal
                    with SessionLocal() as db_session:
                        db_run = db_session.query(FlowRun).filter(FlowRun.id == flow_run.id).first()
                        if db_run:
                            db_run.output_result = final_result.get("output", "")
                            db_run.execution_logs = final_result.get("logs", [])
                            db_run.status = RunStatus.SUCCESS
                            db_run.completed_at = datetime.now()
                            db_session.commit()
            except Exception as ex:
                logger.error(f"Stream error: {ex}")
                # Update DB with failure
                from app.models import SessionLocal
                with SessionLocal() as db_session:
                    db_run = db_session.query(FlowRun).filter(FlowRun.id == flow_run.id).first()
                    if db_run:
                        db_run.status = RunStatus.FAILED
                        db_run.error_message = str(ex)
                        db_run.completed_at = datetime.now()
                        db_session.commit()
                yield f"data: {json.dumps({'type': 'error', 'message': str(ex)})}\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")
        
    except Exception as e:
        logger.error(f"Flow execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/flows", response_model=List[FlowResponse])
async def list_flows(db: Session = Depends(get_db)):
    """Get all saved flows."""
    try:
        flows = db.query(Flow).order_by(Flow.created_at.desc()).all()
        print(f"📁 [API] Listing Flows: Found {len(flows)} flows in database.")
        for f in flows:
            print(f"  - Flow: {f.name} (ID: {f.id})")
        return flows
    except Exception as e:
        print(f"❌ [API] Error listing flows: {str(e)}")
        logger.error(f"Error listing flows: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/flow/generate")
async def generate_flow(request: dict):
    """Generate a flow based on natural language description."""
    try:
        user_request = request.get("prompt", "")
        if not user_request:
            raise HTTPException(status_code=400, detail="Prompt is required")
            
        from app.services.flow_generator_service import flow_generator_service
        flow_data = await flow_generator_service.generate_flow(user_request)
        return flow_data
        
    except Exception as e:
        import traceback
        error_detail = f"{str(e)}\n{traceback.format_exc()}"
        logger.error(f"Error generating flow: {error_detail}")
        raise HTTPException(status_code=500, detail={"error": str(e), "trace": traceback.format_exc()})



@router.get("/flow/{flow_id}", response_model=FlowResponse)
async def get_flow(flow_id: int, db: Session = Depends(get_db)):
    """Get a specific flow by ID."""
    try:
        flow = db.query(Flow).filter(Flow.id == flow_id).first()
        if not flow:
            raise HTTPException(status_code=404, detail="Flow not found")
        return flow
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting flow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/flow/{flow_id}/runs", response_model=List[FlowRunHistoryResponse])
async def get_flow_runs(flow_id: int, db: Session = Depends(get_db)):
    """Get execution history for a specific flow."""
    try:
        runs = db.query(FlowRun).filter(
            FlowRun.flow_id == flow_id
        ).order_by(FlowRun.created_at.desc()).all()
        return runs
    except Exception as e:
        logger.error(f"Error getting flow runs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))




@router.get("/health")
@router.get("/health")
async def health_check():
    """Health check endpoint."""
    from app.services.elasticsearch_service import elasticsearch_service
    
    es_health = elasticsearch_service.health_check()
    
    return {
        "status": "healthy",
        "elasticsearch": "connected" if es_health else "disconnected"
    }


@router.post("/flow/{flow_id}/share")
async def share_flow(flow_id: int, db: Session = Depends(get_db)):
    """Generate or retrieve a share token for a flow."""
    try:
        db_flow = db.query(Flow).filter(Flow.id == flow_id).first()
        if not db_flow:
            raise HTTPException(status_code=404, detail="Flow not found")
        
        if not db_flow.share_token:
            db_flow.share_token = str(uuid.uuid4())[:8]
            db.commit()
            db.refresh(db_flow)
            
        return {"share_token": db_flow.share_token}
    except Exception as e:
        logger.error(f"Error sharing flow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/public/flow/{share_token}")
async def get_public_flow(share_token: str, db: Session = Depends(get_db)):
    """Get a flow by its share token for public viewing."""
    try:
        flow = db.query(Flow).filter(Flow.share_token == share_token).first()
        if not flow:
            raise HTTPException(status_code=404, detail="Shared flow not found")
        
        # Return minimized data (don't expose everything if not needed)
        return {
            "name": flow.name,
            "description": flow.description,
            "flow_data": flow.flow_data
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting public flow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/public/execute/{share_token}")
async def execute_public_flow(share_token: str, request: dict, db: Session = Depends(get_db)):
    """Execute a shared flow with streaming progress."""
    try:
        flow = db.query(Flow).filter(Flow.share_token == share_token).first()
        if not flow:
            raise HTTPException(status_code=404, detail="Shared flow not found")
            
        user_input = request.get("input", "")
        
        async def event_generator():
            async for event_json in flow_executor.execute(flow.flow_data, user_input):
                yield f"data: {event_json}\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")
    except Exception as e:
        logger.error(f"Public execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/flow/export-python")
async def export_python(request: dict):
    """Generate a single Python script from flow data."""
    try:
        nodes = request.get("nodes", [])
        edges = request.get("edges", [])
        code = python_exporter_service.export_flow(nodes, edges)
        return {"code": code}
    except Exception as e:
        logger.error(f"Export error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/flow/ghost-record/start")
async def start_ghost_record():
    asyncio.create_task(ghost_recorder_service.start_recording())
    return {"status": "started"}

@router.post("/flow/ghost-record/stop")
async def stop_ghost_record():
    await ghost_recorder_service.stop_recording()
    return {"status": "stopped"}

@router.get("/flow/ghost-record/events")
async def ghost_record_events():
    from fastapi.responses import StreamingResponse
    
    async def event_generator():
        async for event in ghost_recorder_service.get_events():
            yield f"data: {json.dumps(event)}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")
