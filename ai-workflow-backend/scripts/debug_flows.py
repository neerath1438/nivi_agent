import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, JSON

# Simple model for the script
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Flow(Base):
    __tablename__ = "flows"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    flow_data = Column(JSON)

# Database URL from .env logic
database_url = "postgresql://postgres:1234567890@localhost:5432/ai_workflow"

try:
    engine = create_engine(database_url)
    Session = sessionmaker(bind=engine)
    session = Session()

    flows = session.query(Flow).all()
    output_data = []
    
    for flow in flows:
        output_data.append({
            "id": flow.id,
            "name": flow.name,
            "flow_data": flow.flow_data
        })
    
    with open("flow_debug_utf8.json", "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)
    
    print(f"Successfully saved {len(flows)} flows to flow_debug_utf8.json")

    session.close()
except Exception as e:
    print(f"Error: {e}")
