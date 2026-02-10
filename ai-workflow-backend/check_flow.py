"""Check flow data in database."""
from app.models import get_db, Flow
import json

def check_flow(flow_id: int):
    """Display flow data."""
    db = next(get_db())
    
    try:
        flow = db.query(Flow).filter(Flow.id == flow_id).first()
        
        if not flow:
            print(f"\n❌ Flow ID {flow_id} not found!\n")
            return
        
        print(f"\n{'='*80}")
        print(f"📊 FLOW: {flow.name} (ID: {flow.id})")
        print(f"{'='*80}\n")
        
        flow_data = flow.flow_data
        nodes = flow_data.get('nodes', [])
        
        print(f"Total Nodes: {len(nodes)}\n")
        
        for node in nodes:
            node_type = node.get('type')
            node_id = node.get('id')
            node_data = node.get('data', {})
            
            print(f"Node ID: {node_id}")
            print(f"  Type: {node_type}")
            print(f"  Data: {json.dumps(node_data, indent=4)}")
            print("-" * 80)
        
        print(f"\n{'='*80}\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        flow_id = int(sys.argv[1])
        check_flow(flow_id)
    else:
        print("\nUsage: python check_flow.py <flow_id>")
        print("Example: python check_flow.py 28\n")
