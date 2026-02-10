import asyncio
import os
import sys
import shutil

# Add current directory to path
sys.path.append(os.getcwd())

from app.services.runtime_validator import runtime_validator

async def test_validator():
    print("🧪 Testing RuntimeValidator standalone...")
    
    files = [
        {
            "path": "package.json",
            "content": '{"name":"test","type":"module","scripts":{"dev":"vite"},"dependencies":{"react":"^18.2.0","react-dom":"^18.2.0"},"devDependencies":{"vite":"^5.0.0","@vitejs/plugin-react":"^4.2.0"}}'
        },
        {
            "path": "index.html",
            "content": '<!DOCTYPE html><html><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>'
        },
        {
            "path": "src/main.jsx",
            "content": "import React from 'react';import ReactDOM from 'react-dom/client';import App from './App';ReactDOM.createRoot(document.getElementById('root')).render(<App />);"
        },
        {
            "path": "src/App.jsx",
            "content": "export default function App() { return <h1>Hello</h1> }"
        }
    ]
    
    workspace_id = "standalone_test"
    
    try:
        result = await runtime_validator.verify_project(
            files,
            workspace_id=workspace_id,
            skip_browser=True,
            wait_for_server=True
        )
        
        print(f"\n✅ Result Status: {result.get('status')}")
        print(f"🔗 URL: {result.get('url')}")
        if result.get("error"):
            print(f"❌ Error: {result.get('error')}")
            
        print("\n--- Terminal Output ---")
        print(result.get("terminal_output", "No output"))
        
    except Exception as e:
        print(f"💥 Crash: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_validator())
