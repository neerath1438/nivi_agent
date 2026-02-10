"""Prompt Generator node runner - expands user intent into technical prompts."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner
from app.services.llm_service import LLMService

PROMPT_EXPANSION_SYSTEM = """
You are an expert Technical Architect & UI Designer. Your job is to take a simple user request and expand it into a detailed technical specification for an AI to implement.

If the request is for a UI (React/FastAPI Frontend):
- Architecture: Mandate a professional component-based structure (Sidebar, Navbar, Hero, Stats, Dashboard).
- Mandatory Files: YOU MUST explicitly list these files in your spec: `package.json`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`.
- Styling: Focus on High-End aesthetics. Mention Glassmorphism, Sophisticated Color Palettes, and Micro-animations.
- Components: Require use of Lucide Icons and Recharts for data visualization.

If the request is for Logic/Code (Python/Node):
- Focus on Data structures, Error handling, Core logic modules, and Output requirements (PDFs, Logs).
- Mandatory Files: YOU MUST explicitly list `main.py` (or equivalent) and `requirements.txt`.

CRITICAL INTEGRITY:
- For Web/UI: Require that `index.html` has a `<div id="root"></div>` and a script tag for `/src/main.jsx`.
- For Apps: Never suggest a single-file solution. Always demand modularity.
- CRITICAL: Only suggest libraries available: 
  - Python: `fastapi`, `requests`, `pydantic`, `sqlalchemy`, `fpdf2`, `pandas`, `openpyxl`.
  - Node.js: `express`, `axios`, `dotenv`, `cors`.
  - UI: `recharts`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.

Keep the output as a structured, detailed technical requirement.
"""

class PromptGeneratorRunner(BaseRunner):
    """Runner for expanding simple prompts into technical specifications."""
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        user_input = node_data.get("prompt", state.get("input", ""))
        
        # Get selected technologies from state
        frontend = state.get("frontend_lang")
        backend = state.get("backend_lang")
        
        tech_context = ""
        if frontend or backend:
            tech_context = f"\nTarget Technologies: Frontend={frontend or 'Any'}, Backend={backend or 'Any'}."

        if not user_input:
            return {"expanded_prompt": "No input to expand", "output": "No input to expand"}
            
        service = LLMService()
        response = service.chat_completion(
            messages=[
                {"role": "system", "content": PROMPT_EXPANSION_SYSTEM},
                {"role": "user", "content": f"Expand this requirement: {user_input}{tech_context}"}
            ],
            model="gpt-4o-mini",
            temperature=0.7
        )
        
        expanded_text = response["text"]
        
        return {
            "expanded_prompt": expanded_text,
            "output": expanded_text,
            "prompt": expanded_text # Overwrite prompt for next nodes
        }
