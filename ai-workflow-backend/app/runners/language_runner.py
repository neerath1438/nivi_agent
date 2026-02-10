"""Language node runner - sets the target programming language for code generation."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner

class LanguageRunner(BaseRunner):
    """Runner for setting the target programming language."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        # Determine if this is a frontend or backend node based on node_type or data
        is_frontend = node_data.get("is_frontend", True)
        selected_lang = node_data.get("language", "React + Tailwind")
        
        updates = {}
        if is_frontend:
            updates["frontend_lang"] = selected_lang
            msg = f"Frontend Stack set to: **{selected_lang}** 🎨"
        else:
            updates["backend_lang"] = selected_lang
            msg = f"Backend Stack set to: **{selected_lang}** ⚙️"
            
        return {
            **updates,
            "output": msg
        }
