import asyncio
import os
import sys
import json
import logging
from typing import Dict, Any, List

# Add current directory to path so we can import app
sys.path.append(os.getcwd())

from app.runners.ui_components_runner import UIComponentsRunner
from app.services.runtime_validator import runtime_validator

logging.basicConfig(level=logging.INFO)

async def test_ui_build():
    runner = UIComponentsRunner()
    
    # Mock files that would come from LLM
    mock_files = [
        {
            "path": "package.json",
            "content": json.dumps({
                "name": "test-project",
                "private": True,
                "version": "0.0.0",
                "type": "module",
                "scripts": {
                    "dev": "vite",
                    "build": "vite build"
                },
                "dependencies": {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0"
                },
                "devDependencies": {
                    "vite": "^5.0.0",
                    "@vitejs/plugin-react": "^4.2.0"
                }
            }, indent=2)
        },
        {
            "path": "src/App.jsx",
            "content": "export default function App() { return <div className='p-10 bg-blue-500 text-white'>Hello World</div> }"
        }
    ]
    
    # Process files as runner would
    print("🔄 Processing mock project files...")
    files, stubs = runner._apply_auto_stubbing(mock_files)
    files = runner._harmonize_dependencies(files)
    
    workspace_id = "debug_test"
    print(f"🏗️ Starting build verification in workspace: {workspace_id}")
    
    # Run the validator
    result = await runtime_validator.verify_project(
        files,
        workspace_id=workspace_id,
        skip_browser=True,
        wait_for_server=True
    )
    
    print("\n" + "="*30)
    print(f"RESULT STATUS: {result.get('status')}")
    print(f"URL: {result.get('url')}")
    if result.get("error"):
        print(f"ERROR: {result.get('error')}")
    print("="*30)
    
    # Cleanup (manual if server is running)
    print("\n[NOTE] If success, server is still running on port 5174. Cleanup will happen on next run or exit.")

if __name__ == "__main__":
    try:
        asyncio.run(test_ui_build())
    except KeyboardInterrupt:
        print("\nStopping...")
