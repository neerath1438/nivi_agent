import asyncio
import os
import sys
import json
import logging
from typing import Dict, Any, List

# Add current directory to path
sys.path.append(os.getcwd())

from app.runners.ui_components_runner import UIComponentsRunner

async def test_ui_healing():
    runner = UIComponentsRunner()
    
    # This is a sample of what might be causing issues: 
    # A truncated or malformed JSON array of files.
    broken_json = """
    [
        {
            "path": "package.json",
            "content": "{\\n  \\"name\\": \\"vite-project\\",\\n  \\"type\\": \\"module\\"\\n}"
        },
        {
            "path": "src/App.jsx",
            "content": "import React from 'react';\\nexport default function App() { return <div>Hi</div> }"
        }
    """ # Missing closing bracket and maybe truncated in middle
    
    print("Testing _clean_json with truncated input...")
    cleaned = runner._clean_json(broken_json)
    print(f"Cleaned Length: {len(cleaned)}")
    print(f"Cleaned Content (tail): ...{cleaned[-20:]}")
    
    try:
        data = json.loads(cleaned)
        print(f"✅ JSON Parse Success! Items: {len(data)}")
    except Exception as e:
        print(f"❌ JSON Parse Failed: {e}")

    # Now let's simulate the run loop with a mock service
    class MockService:
        def chat_completion(self, messages, model, **kwargs):
            # Return something that will fail verification pass 1
            # but provide valid JSON
            return {"text": json.dumps([{"path": "App.jsx", "content": "import Missing from './Missing';"}])}

    runner_state = {
        "prompt": "Test Project",
        "model": "gpt-4o-mini",
        "apiKey": "mock_key"
    }
    
    print("\n--- Simulating Runner.run with Auto-Healing ---")
    # We can't easily mock the whole runtime_validator without monkeypatching
    # for now let's just test the file processing logic
    
    raw_response = "[{\"path\": \"src/App.jsx\", \"content\": \"import { Something } from './Missing';\"}]"
    current_attempt = 1
    max_attempts = 3
    
    while current_attempt <= max_attempts:
        print(f"Pass {current_attempt}")
        error_log = ""
        files = []
        try:
            cleaned_json = runner._clean_json(raw_response)
            files = json.loads(cleaned_json)
            print(f"  Parsed {len(files)} files")
            
            # Normalization
            for f in files:
                p = f.get("path", "").replace("\\", "/").strip("./")
                f["path"] = p
            
            files, stubs = runner._apply_auto_stubbing(files)
            files = runner._harmonize_dependencies(files)
            
            import_errors = runner._verify_imports(files)
            if import_errors:
                error_log = import_errors
                print(f"  ⚠️ Import Errors: {import_errors}")
        except Exception as e:
            error_log = f"JSON Error: {e}"
            print(f"  ❌ Error: {error_log}")
            
        if not error_log:
            print("  ✅ Success!")
            break
            
        print(f"  Healing Pass {current_attempt}...")
        # Mock healing response
        if current_attempt == 1:
            raw_response = "[{\"path\": \"src/App.jsx\", \"content\": \"import React from 'react'; export default function App() { return <div>Fixed</div> }\"}]"
        else:
            raw_response = "Invalid Junk" # Force failure
            
        current_attempt += 1

    print(f"\nFinal State - Attempt: {current_attempt}, Files: {len(files)}")

if __name__ == "__main__":
    asyncio.run(test_ui_healing())
