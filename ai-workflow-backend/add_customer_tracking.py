import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.models.database import engine

def migrate():
    print("🚀 Starting migration: Adding whatsapp_customers table...")
    with engine.connect() as conn:
        try:
            # Check if table exists
            result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_name='whatsapp_customers'"))
            if not result.fetchone():
                print("📝 Table 'whatsapp_customers' not found. Creating it...")
                conn.execute(text("""
                    CREATE TABLE whatsapp_customers (
                        id SERIAL PRIMARY KEY,
                        phone_number VARCHAR(20) UNIQUE NOT NULL,
                        first_message TEXT,
                        link_sent BOOLEAN DEFAULT FALSE NOT NULL,
                        sent_at TIMESTAMP WITH TIME ZONE,
                        source VARCHAR(50) DEFAULT 'direct' NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                conn.execute(text("CREATE INDEX idx_phone_number ON whatsapp_customers(phone_number)"))
                conn.commit()
                print("✅ Table 'whatsapp_customers' created successfully!")
            else:
                print("ℹ️ Table 'whatsapp_customers' already exists.")
        except Exception as e:
            print(f"❌ Error during migration: {str(e)}")

if __name__ == "__main__":
    migrate()
