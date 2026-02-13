import sys
import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add app directory to path
sys.path.append(os.getcwd())

from app.models.flow import Flow
from app.models.database import SessionLocal

def dump_latest_flow():
    db = SessionLocal()
    try:
        # Get specified flow ID
        flow_id = 475
        flow = db.query(Flow).filter(Flow.id == flow_id).first()
        if not flow:
            print(f"Flow {flow_id} not found. Dumping latest instead.")
            flow = db.query(Flow).order_by(Flow.updated_at.desc()).first()
            
        if not flow:
            print("No flows found in DB.")
            return

        print(f"--- Flow ID: {flow.id} Name: {flow.name} ---")
        flow_data = flow.flow_data
        nodes = flow_data.get("nodes", [])
        edges = flow_data.get("edges", [])

        print(f"\nNodes ({len(nodes)}):")
        for n in nodes:
            print(f"  - ID: {n.get('id')} Type: {n.get('type')}")

        print(f"\nEdges ({len(edges)}):")
        for e in edges:
            print(f"  - {e.get('source')} -> {e.get('target')} (Handle: {e.get('sourceHandle')})")

        # Save to file for easy reading
        with open("flow_dump.json", "w") as f:
            json.dump(flow_data, f, indent=2)
        print("\nFull flow data saved to flow_dump.json")

    finally:
        db.close()

if __name__ == "__main__":
    dump_latest_flow()
