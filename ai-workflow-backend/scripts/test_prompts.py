try:
    from app.services.prompts import MONGODB_RAG_PROMPT
    print("✅ MONGODB_RAG_PROMPT imported successfully")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
