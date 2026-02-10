"""Master Prompt node runner - converts expanded descriptions into structured JSON."""
from typing import Dict, Any
import json
from app.runners.base_runner import BaseRunner
from app.services.llm_service import LLMService

MASTER_PROMPT_SYSTEM = """
You are a Technical Lead & Solution Architect. Your job is to take a detailed specification (UI or Backend Logic) and convert it into a structured MASTER JSON format.
This JSON will be used by an AI to generate code that MUST WOW the user.

If UI-focused (Frontend):
- Include layout, premium components (e.g., GlassCard, NeonButton, InteractiveChart), visual themes, and micro-animations.
- Explicitly list 'visual_fidelity' as a top-priority constraint.
- Require specific UI components like Analytics Charts (Recharts) and Iconography (Lucide).

If Backend/Logic-focused (Python/Node):
- Focus on business logic, data models, API endpoints, error handling, and robust file operations.
- Ensure 'logic' captures every nuanced calculation and edge case.

The JSON MUST include:
1. objective: The ultimate goal (e.g., 'A stunning, high-performance SaaS dashboard').
2. constraints: Critical requirements including visual aesthetics and tech stack.
3. tech_stack: Mandatory libraries (e.g., React, Tailwind, Recharts).
4. config_files: Mandatory configuration files (e.g., package.json, tailwind.config.js).
5. entry_points: The main startup files (e.g., index.html, main.jsx, App.jsx).
6. components: Granular list of modular files/components to be generated.
7. logic: Step-by-step processing logic or interactive behaviors.
8. output_format: 'Multi-file JSON structure for complete project'.

OUTPUT ONLY THE JSON. NO OTHER TEXT.
"""

class MasterPromptRunner(BaseRunner):
    """Runner for converting descriptions into structured Master JSON."""
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        expanded_prompt = state.get("expanded_prompt", state.get("prompt", state.get("input", "")))
        
        if not expanded_prompt:
            return {"master_json": {}, "output": "No prompt to structure"}
            
        service = LLMService()
        response = service.chat_completion(
            messages=[
                {"role": "system", "content": MASTER_PROMPT_SYSTEM},
                {"role": "user", "content": f"Convert this specification into a Master JSON: {expanded_prompt}"}
            ],
            model="gpt-4o-mini",
            temperature=0.3 # Lower temperature for better structure
        )
        
        json_text = response["text"]
        
        # Clean up JSON if LLM included backticks
        if "```json" in json_text:
            json_text = json_text.split("```json")[1].split("```")[0].strip()
        elif "```" in json_text:
            json_text = json_text.split("```")[1].split("```")[0].strip()
            
        try:
            master_json = json.loads(json_text)
            final_output = f"### 💎 Master JSON Generated:\n```json\n{json.dumps(master_json, indent=2)}\n```"
            
            return {
                "master_json": master_json,
                "output": final_output,
                "prompt": json_text # Pass JSON as prompt to next node (LLM or UI gen)
            }
        except Exception as e:
            return {
                "master_json": {"raw": json_text},
                "output": f"Error parsing JSON output: {str(e)}\nRaw Response: {json_text}",
                "prompt": json_text
            }
