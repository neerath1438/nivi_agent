import psycopg2
import os
from urllib.parse import urlparse

# DATABASE_URL=postgresql://postgres:1234567890@localhost:5432/ai_workflow
db_url = "postgresql://postgres:1234567890@localhost:5432/ai_workflow"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM flows")
    rows = cursor.fetchall()
    print(f"✅ Found {len(rows)} flows in database:")
    for row in rows:
        print(f"  ID: {row[0]}, Name: {row[1]}")
    conn.close()
except Exception as e:
    print(f"❌ Error connecting to PostgreSQL: {e}")
