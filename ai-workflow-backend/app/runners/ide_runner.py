import os
from typing import Dict, Any, List
from app.runners.base_runner import BaseRunner

class IDERunner(BaseRunner):
    """
    Runner for preparing an IDE-like view in the frontend.
    It takes the project structure (files) and exposes it to the UI.
    """
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes project structure and signals the frontend to show the IDE view.
        """
        # Try to get project structure from preceding nodes
        project_data = state.get("project_structure") or state.get("files")
        
        # Fallback: recover from generated_code if exists
        if not project_data and "generated_code" in state:
            import json
            try:
                candidate = state["generated_code"]
                if isinstance(candidate, str):
                    first_b = candidate.find("[")
                    last_b = candidate.rfind("]")
                    if first_b != -1 and last_b != -1:
                        parsed = json.loads(candidate[first_b:last_b+1])
                        if isinstance(parsed, list):
                            project_data = parsed
            except:
                pass

        if not project_data:
            return {
                "output": "IDE Error: No project structure found to display.",
                "status": "error"
            }

        # Organize files: Put them under a 'backend/' folder for better grouping in the IDE
        files = project_data
        if any(f.get("path", "").startswith("app/") or f.get("path", "") == "main.py" for f in files):
            updated_files = []
            for f in files:
                new_f = f.copy()
                if not f.get("path", "").startswith("backend/"):
                    new_f["path"] = f"backend/{f['path']}"
                updated_files.append(new_f)
            files = updated_files

        # IDE data for the frontend
        project_name = node_data.get("project_name", "Generated Project")
        ide_data = {
            "files": files,
            "project_name": project_name,
            "entry_point": "backend/app/main.py" if any(f["path"] == "backend/app/main.py" for f in files) else state.get("entry_point", "app/main.py"),
            "port": state.get("port")
        }

        # Real File System Persistence: Write files to disk
        try:
            # Base directory for the user's projects
            base_dir = "C:\\Users\\Admin\\Agemt-chatbot"
            # Ensure the base project folder name matches the project name (sanitized for folder)
            safe_project_name = project_name.replace(" ", "_").replace("-", "_")
            project_path = os.path.join(base_dir, safe_project_name)
            
            # Create the project directory if it doesn't exist
            if not os.path.exists(project_path):
                os.makedirs(project_path, exist_ok=True)
            
            # Write each file in the project structure
            for file_info in files:
                rel_path = file_info.get("path", "")
                content = file_info.get("content", "")
                
                # Full path to the file
                full_path = os.path.join(project_path, rel_path)
                
                # Ensure the directory for the file exists
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                
                # Write the content
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(content)
            
            # Update ide_data with the physical path for reference if needed
            ide_data["physical_path"] = project_path
            
            # Specifically point to the backend folder if it exists
            backend_path = os.path.join(project_path, "backend")
            if os.path.exists(backend_path):
                ide_data["backend_path"] = backend_path
            else:
                ide_data["backend_path"] = project_path
            
        except Exception as e:
            # Log error but don't fail the node, as the UI can still show the code from memory
            print(f"Error writing files to disk: {str(e)}")

        return {
            "ide_data": ide_data,
            "output": f"IDE environment initialized. Files written to local storage at {ide_data.get('physical_path')}",
            "execution_result": "IDE_READY",
            "status": "success"
        }
