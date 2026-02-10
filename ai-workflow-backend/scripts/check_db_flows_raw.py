from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:1234567890@localhost:5432/ai_workflow"

def check_flows():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT id, name, created_at FROM flows"))
            rows = result.fetchall()
            print(f"Total Flows found: {len(rows)}")
            for row in rows:
                print(f"- ID: {row[0]}, Name: {row[1]}, Created: {row[2]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_flows()
