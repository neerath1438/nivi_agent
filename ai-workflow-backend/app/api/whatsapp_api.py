import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Dict, Any, List

from app.models import Flow, get_db, SessionLocal
from app.services.whatsapp_service import whatsapp_service
from app.services.flow_executor import flow_executor

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

class WhatsAppWebhookRequest(BaseModel):
    sender: str = Field(alias="from")
    name: str = ""
    content: str
    timestamp: int

@router.get("/status")
async def get_whatsapp_status():
    """Get connection status and QR code."""
    return whatsapp_service.get_status()

@router.post("/reset")
async def reset_whatsapp_connection():
    """Reset the WhatsApp connection by clearing session data."""
    success = whatsapp_service.reset_bridge()
    return {"status": "success" if success else "error"}

@router.post("/webhook")
async def whatsapp_webhook(request: WhatsAppWebhookRequest, background_tasks: BackgroundTasks):
    """Handle incoming messages from the bridge."""
    # print(f"\n📢 [WEBHOOK] Message received from WhatsApp Bridge!")
    # print(f"📢 [WEBHOOK] From: {request.sender}, Name: {request.name}")
    # print(f"📢 [WEBHOOK] Content: {request.content}")
    logger.info(f"📩 Received WhatsApp message from {request.sender}: {request.content}")
    
    # Run in background to respond quickly to the bridge
    background_tasks.add_task(process_whatsapp_message, request.sender, request.content)
    
    return {"status": "received"}

async def process_whatsapp_message(sender_jid: str, content: str):
    """Find and execute flows that have a WhatsApp Input node."""
    db = SessionLocal()
    try:
        # Fetch flows ordered by updated_at (latest first)
        flows = db.query(Flow).order_by(Flow.updated_at.desc(), Flow.id.desc()).all()
        logger.info(f"🔍 Searching through {len(flows)} flows for WhatsApp triggers...")
        
        found_any = False
        for flow in flows:
            flow_data = flow.flow_data
            nodes = flow_data.get("nodes", [])
            
            # Check if flow has a WhatsApp input node
            wa_input_node = next((node for node in nodes if node.get("type") == "whatsAppInput"), None)
            
            if wa_input_node:
                # 🛡️ Sender Filtering Logic
                node_data = wa_input_node.get("data", {})
                mode = node_data.get("mode", "everyone")
                allowed_str = node_data.get("allowedNumbers", "")
                
                # Extract clean numbers (only digits) from JID
                sender_number = "".join(filter(str.isdigit, sender_jid.split("@")[0]))
                
                logger.info(f"🛡️ [FILTER] Mode: {mode}, Sender JID: {sender_jid}, Sender Number Only: {sender_number}")
                
                should_trigger = True
                if mode == "specific":
                    # Clean the allowed numbers (remove +, spaces, etc. keep only digits)
                    raw_list = [n.strip() for n in allowed_str.replace(",", " ").split() if n.strip()]
                    allowed_list = ["".join(filter(str.isdigit, n)) for n in raw_list]
                    
                    # Check if sender number is in allowed list
                    if sender_number not in allowed_list:
                        logger.warning(f"🚫 [FILTER] Blocked! Sender {sender_number} not in allowed list.")
                        should_trigger = False
                    else:
                        logger.info(f"✅ [FILTER] Allowed! Sender {sender_number} matched.")

                if should_trigger:
                    found_any = True
                    logger.info(f"🚀 Triggering flow '{flow.name}' (ID: {flow.id}) via WhatsApp")
                    
                    # Execute the flow with initial state containing the sender's JID
                    async for _ in flow_executor.execute(flow_data, content, initial_state={
                        "whatsapp_jid": sender_jid,
                        "from": sender_jid  # For phone number extraction
                    }):
                        pass
                    
                    # 🛑 Stop after first match to prevent double replies if multiple flows have WhatsApp triggers
                    break
        
        if not found_any:
            logger.warning("⚠️ No flows found with a WhatsApp Trigger node.")
                
    except Exception as e:
        logger.error(f"❌ Error processing WhatsApp message flow: {str(e)}", exc_info=True)
    finally:
        db.close()
