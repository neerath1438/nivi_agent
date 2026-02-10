import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'ai-workflow-backend'))

from dotenv import load_dotenv
load_dotenv('ai-workflow-backend/.env')

from app.services.flow_generator_service import flow_generator_service

async def test_generate():
    print("Testing flow generation...")
    try:
        result = await flow_generator_service.generate_flow("Create a simple bot for SK Sports Wear")
        print("✅ SUCCESS!")
        print(f"Nodes count: {len(result.get('nodes', []))}")
        print(f"Edges count: {len(result.get('edges', []))}")
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_generate())
