import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.models.database import engine

def migrate():
    print("🚀 Starting migration: Adding share_token to flows table...")
    with engine.connect() as conn:
        try:
            # Check if column exists
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='flows' AND column_name='share_token'"))
            if not result.fetchone():
                print("📝 Column 'share_token' not found. Adding it...")
                conn.execute(text("ALTER TABLE flows ADD COLUMN share_token VARCHAR UNIQUE NULL"))
                conn.commit()
                print("✅ Column 'share_token' added successfully!")
            else:
                print("ℹ️ Column 'share_token' already exists.")
        except Exception as e:
            print(f"❌ Error during migration: {str(e)}")

if __name__ == "__main__":
    migrate()
