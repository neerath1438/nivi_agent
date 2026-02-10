"""Prompt template node runner."""
import re
from typing import Dict, Any
from app.runners.base_runner import BaseRunner
from app.services.schema_loader import get_schema_loader
from app.services.prompts import QUERY_PLANNER_PROMPT, MONGODB_RAG_PROMPT, GENERIC_RAG_PROMPT


class PromptRunner(BaseRunner):
    """Runner for prompt template node."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create prompt from template or fallback to query planner.
        """
        user_input = state.get("input", "")
        template = node_data.get("template")
        context = state.get("context")
        
        if template:
            prompt = template
        elif context:
            print(f"📄 RAG Context detected. Using GENERIC_RAG_PROMPT.")
            prompt = GENERIC_RAG_PROMPT
        else:
            # Fallback to query planner
            print(f" Falling back to QUERY_PLANNER_PROMPT for: {user_input}")
            schema_loader = get_schema_loader()
            schema_context = schema_loader.get_schema_context()
            prompt = QUERY_PLANNER_PROMPT.format(
                schema=schema_context,
                user_message=user_input
            )
            return {"prompt": prompt, "output": prompt}
        
        # 2. Dynamic Variable Resolution
        # This replaces any {var} or {{var}} with state.get(var)
        def resolve_match(match):
            # Extract variable name from whichever group matched
            m = match.group(1) or match.group(2)
            m = m.strip() # Remove whitespace like in {{ var }}
            
            if m == "input" or m == "user_message": return str(user_input)
            if m == "context": return str(context) if context else "No context data"
            
            val = state.get(m)
            if val is not None:
                return str(val)
            return match.group(0) # Keep literal if not found

        # Unified Regex for {{var}} or {var}
        pattern = r"\{\{([^}]+)\}\}|\{([^}]+)\}"
        prompt = re.sub(pattern, resolve_match, prompt)

        if prompt == GENERIC_RAG_PROMPT:
            prompt = prompt.format(context=context, user_message=user_input)
        
        print(f"📝 Generated Prompt ({len(prompt)} chars):")
        print(f"--- PROMPT START ---\n{prompt}\n--- PROMPT END ---")
        
        return {
            "prompt": prompt,
            "output": prompt
        }


prompt_runner = PromptRunner()
