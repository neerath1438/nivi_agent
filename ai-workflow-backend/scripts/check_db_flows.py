from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.flow import Flow
import json

# Setup database
DB_URL = "postgresql://postgres:postgres@localhost:5432/ai_workflow_builder"
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_flows():
    db = SessionLocal()
    try:
        flows = db.query(Flow).all()
        print(f"Total flows: {len(flows)}")
        for flow in flows:
            print(f"\n--- Flow: {flow.name} (ID: {flow.id}) ---")
            nodes = flow.flow_data.get('nodes', [])
            edges = flow.flow_data.get('edges', [])
            print(f"Nodes ({len(nodes)}):")
            for node in nodes:
                print(f"  - [{node['id']}] {node['type']} (Label: {node.get('data', {}).get('label')})")
            print(f"Edges ({len(edges)}):")
            for edge in edges:
                print(f"  - {edge['source']} -> {edge['target']}")
    finally:
        db.close()

if __name__ == "__main__":
    check_flows()
