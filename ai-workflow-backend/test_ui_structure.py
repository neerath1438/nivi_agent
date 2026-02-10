import json
import os
import sys

# Mock UIComponentsRunner logic for extraction
def extract_files(raw_json):
    try:
        data = json.loads(raw_json)
        # Case 1: Already an array
        if isinstance(data, list):
            return data
        
        # Case 2: Nested in 'project' -> 'files' or similar
        print(f"🕵️ Detected object instead of list. Searching for file array...")
        
        # Look for any key that contains a list of dicts with 'path' and 'content'
        search_queue = [data]
        while search_queue:
            curr = search_queue.pop(0)
            if isinstance(curr, dict):
                for key, value in curr.items():
                    if isinstance(value, list) and len(value) > 0 and isinstance(value[0], dict) and "path" in value[0]:
                        print(f"✅ Found file array in key: '{key}'")
                        return value
                    if isinstance(value, (dict, list)):
                        search_queue.append(value)
        return None
    except Exception as e:
        print(f"❌ Extraction Error: {e}")
        return None

def main():
    # This is what AI returned in the user's logs
    nested_json = {
        "project": {
            "objective": "A visual crypto dashboard",
            "files": [
                {"path": "package.json", "content": "{}"},
                {"path": "src/App.jsx", "content": "export default function App() { return <div>Hi</div> }"}
            ]
        }
    }
    
    raw_str = json.dumps(nested_json)
    print("Testing extraction from nested JSON...")
    files = extract_files(raw_str)
    
    if files and len(files) > 0:
        print(f"🎉 Success! Extracted {len(files)} files.")
        for f in files:
            print(f"  - {f['path']}")
    else:
        print("💀 Failed to extract files.")

if __name__ == "__main__":
    main()
