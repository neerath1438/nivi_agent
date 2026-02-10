from sqlalchemy import create_engine, text
import json

DATABASE_URL = "postgresql://postgres:1234567890@localhost:5432/ai_workflow"

def check_corruption():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT id, name, flow_data FROM flows"))
            rows = result.fetchall()
            print(f"Checking {len(rows)} flows...")
            for row in rows:
                flow_id, name, flow_data = row
                print(f"Flow ID: {flow_id}, Name: {name}")
                if flow_data is None:
                    print("  ❌ flow_data is NONE")
                    continue
                
                # Check if it's already a dict (SQLAlchemy JSON type usually handles this)
                if isinstance(flow_data, str):
                    print("  ⚠️ flow_data is a STRING (should be a DICT if using JSON column)")
                    try:
                        json.loads(flow_data)
                        print("    ✅ String is valid JSON")
                    except Exception as e:
                        print(f"    ❌ String is INVALID JSON: {e}")
                elif isinstance(flow_data, dict):
                    print("  ✅ flow_data is a DICT")
                else:
                    print(f"  ❌ flow_data is UNKNOWN TYPE: {type(flow_data)}")
                    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_corruption()
