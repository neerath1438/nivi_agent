import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'ai-workflow-backend'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.flow_model import Flow
from app.config import settings

def check_flows():
    try:
        engine = create_engine(settings.database_url)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        flows = db.query(Flow).all()
        print(f"Total Flows found: {len(flows)}")
        for f in flows:
            print(f"- ID: {f.id}, Name: {f.name}, Created: {f.created_at}")
        
        db.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_flows()
