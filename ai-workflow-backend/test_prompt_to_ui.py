import asyncio
import json
import os
import sys

# Ensure we can import from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.runners.ui_components_runner import UIComponentsRunner

MASTER_JSON = {
  "objective": "A stunning, high-performance 3D Crypto Portfolio Dashboard",
  "constraints": {
    "visual_fidelity": True,
    "aesthetics": "Glassmorphism with deep purples and neon cyan color scheme",
    "responsive_design": True
  },
  "tech_stack": [
    "react",
    "tailwindcss",
    "recharts",
    "lucide-react",
    "framer-motion",
    "clsx",
    "tailwind-merge"
  ],
  "config_files": [
    "package.json",
    "tailwind.config.js"
  ],
  "entry_points": [
    "index.html",
    "src/main.jsx",
    "src/App.jsx",
    "src/index.css"
  ],
  "components": {
    "Sidebar": { "description": "Navigation links and portfolio summary" },
    "Navbar": { "description": "Branding and user profile settings" },
    "Hero": { "description": "Main title and introduction" },
    "Stats": { "description": "Key metrics with Glassmorphism" },
    "Dashboard": { "description": "3D animated chart and portfolio details" }
  }
}

async def test_generation():
    print("🚀 Starting Verification: Master JSON to UI Code...")
    runner = UIComponentsRunner()
    
    # Simulate a flow state
    state = {
        "prompt": json.dumps(MASTER_JSON),
        "selected_theme": "Glassmorphism",
        "frontend_stack": "React + Tailwind",
        "model": "gpt-4o-mini"
    }
    
    print("🤖 Calling UIComponentsRunner (this might take a minute)...")
    result = await runner.run({"node_id": "test_verify_1"}, state)
    
    if result.get("status") == "success":
        print("\n✅ SUCCESS!")
        print(f"📂 Generated Files: {len(result.get('project_structure', []))}")
        print(f"🌐 Preview URL: {result.get('url')}")
        
        # Check for mandatory files
        paths = [f["path"] for f in result["project_structure"]]
        print("\n🧐 Verifying Structural Integrity:")
        for essential in ["index.html", "src/main.jsx", "package.json"]:
            status = "✅" if essential in paths else "❌"
            print(f"  {status} {essential}")
            
        # Check index.html content
        index_html = next((f["content"] for f in result["project_structure"] if f["path"] == "index.html"), "")
        if "id=\"root\"" in index_html and "src=\"/src/main.jsx\"" in index_html:
            print("  ✅ index.html contains root div and script tag.")
        else:
            print("  ❌ index.html is missing root or script!")
            
    else:
        print("\n❌ FAILURE!")
        print(f"Error: {result.get('output')}")

if __name__ == "__main__":
    asyncio.run(test_generation())
