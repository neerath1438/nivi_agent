import os
import json
from typing import Dict, Any, List
from app.runners.base_runner import BaseRunner
from app.services.llm_service import LLMService
from app.services.gemini_service import GeminiService

class ProjectPlannerRunner(BaseRunner):
    """
    Runner that generates an end-to-end Technical Blueprint for a project.
    Follows a strict FastAPI structure and generates multiple files.
    """
    
    SYSTEM_PROMPT = """You are a Senior Technical Architect.
Your goal is to generate a professional, end-to-end FastAPI backend boilerplate for a given project requirement.

### STRICT RULES:
1. You MUST follow this EXACT folder structure:
   - app/main.py
   - app/core/config.py
   - app/api/v1/auth.py
   - app/api/v1/routes.py
   - app/models/schemas.py
   - app/services/logic.py
   - app/utils/helpers.py
   - .env.example
   - Dockerfile
   - docker-compose.yml
   - seed_data.py (for initial Roles & Permissions)

2. FEATURES & QUALITY:
   - **NO PLACEHOLDERS**: Do NOT write comments like "# Implement logic here" or "// ...". Write the FULL, working code for every single function and endpoint.
   - **FULL CRUD**: For the main entities mentioned in the requirement, implement all CRUD (Create, Read, Update, Delete) endpoints in `routes.py`.
   - **SECURITY**: Complete JWT implementation using **HttpOnly Cookies**.
   - **RBAC**: Implement middleware that actually checks roles.
   - **DATABASE**: Write actual SQLAlchemy or Tortoise models in `schemas.py`.

3. OUTPUT FORMAT:
   Your response MUST be a valid JSON object with the following structure:
   {{
       "blueprint": "Markdown of the technical architecture explanation",
       "files": [
           {{ "path": "app/main.py", "content": "...COMPLETE code..." }},
           ... all other files ...
       ]
   }}
   ONLY return the JSON. No conversational filler.

Project Requirement: {project_description}
"""

    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        project_description = state.get("input", node_data.get("description", ""))
        
        if not project_description:
            return {"output": "Error: No project description provided.", "status": "error"}
            
        provider = state.get("provider", "openai")
        model = state.get("model", "gpt-4o-mini")
        api_key = state.get("apiKey")
        
        # Determine which service to use
        try:
            if provider == "gemini":
                service = GeminiService(api_key=api_key)
                prompt = self.SYSTEM_PROMPT.format(project_description=project_description)
                response = service.generate_text(
                    prompt=prompt, 
                    model="gemini-1.5-flash", 
                    max_tokens=4000
                )
                response_text = response["text"]
            else:
                service = LLMService(api_key=api_key)
                response = service.chat_completion(
                    messages=[
                        {"role": "system", "content": self.SYSTEM_PROMPT.format(project_description=project_description)}
                    ],
                    model=model,
                    temperature=0.7,
                    max_tokens=4000
                )
                response_text = response["text"]

            # Parse JSON from response
            try:
                # Cleanup markdown code blocks if present
                clean_json = response_text.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:-3].strip()
                elif clean_json.startswith("```"):
                    clean_json = clean_json[3:-3].strip()
                    
                data = json.loads(clean_json)
                blueprint = data.get("blueprint", "No blueprint generated.")
                files = data.get("files", [])
                
                return {
                    "output": blueprint,
                    "project_structure": files, # For ZipRunner
                    "files": files,
                    "status": "success"
                }
            except Exception as e:
                print(f"❌ ProjectPlannerRunner JSON Parse Error: {str(e)}\nResponse: {response_text[:500]}...")
                return {
                    "output": f"AI response was not in valid JSON format: {response_text}",
                    "status": "partial_success",
                    "raw_response": response_text
                }
                
        except Exception as e:
            return {"output": f"LLM Error: {str(e)}", "status": "error"}
