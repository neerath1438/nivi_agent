import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'ai-workflow-backend'))

from app.models import SessionLocal, Flow
import json

db = SessionLocal()
try:
    flows = db.query(Flow).all()
    print(f"Total Flows: {len(flows)}")
    for flow in flows:
        wa_node = next((n for n in flow.flow_data.get("nodes", []) if n.get("type") == "whatsAppInput"), None)
        trigger = wa_node.get("data", {}).get("mode", "N/A") if wa_node else "No WA Node"
        print(f"ID: {flow.id} | Name: {flow.name} | WA Trigger: {trigger}")
finally:
    db.close()
