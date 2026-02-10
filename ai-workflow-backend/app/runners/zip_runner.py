import os
import zipfile
import tempfile
import shutil
from datetime import datetime
from typing import Dict, Any, List
from app.runners.base_runner import BaseRunner

class ZipRunner(BaseRunner):
    """Runner for Zipping and Unzipping files and folders."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        mode = node_data.get("mode", "compress")
        output_name = node_data.get("filename", f"project_{int(datetime.now().timestamp())}.zip")
        
        if not output_name.endswith(".zip"):
            output_name += ".zip"

        try:
            if mode == "compress":
                return self._handle_compression(output_name, state)
            else:
                return self._handle_extraction(state)
        except Exception as e:
            return {"output": f"Zip Error: {str(e)}", "status": "error"}

    def _handle_compression(self, filename: str, state: Dict[str, Any]) -> Dict[str, Any]:
        # Priority 1: Multi-file project structure from UIComponentsRunner
        project_data = state.get("project_structure") or state.get("files")
        
        # Priority 2: Single generated code fallback
        # Priority 3: Deep Search State Recovery (Search all keys for multi-file JSON)
        if not project_data:
            import json
            for key, val in state.items():
                if isinstance(val, str) and "[" in val and "{" in val and "path" in val:
                    first_b = val.find("[")
                    last_b = val.rfind("]")
                    if first_b != -1 and last_b != -1:
                        try:
                            candidate = val[first_b:last_b+1]
                            parsed = json.loads(candidate)
                            if isinstance(parsed, list) and len(parsed) > 0 and "path" in parsed[0]:
                                project_data = parsed
                                print(f"🩹 [Zip Utility] Recovered project structure from state key: {key}")
                                break
                        except: pass

        if not project_data:
            return {"output": "No files found to compress. Even deep search failed to recover any project structure.", "status": "error"}

        output_dir = "static/downloads"
        os.makedirs(output_dir, exist_ok=True)
        filepath = os.path.join(output_dir, filename)

        with zipfile.ZipFile(filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
            if isinstance(project_data, list):
                for file_info in project_data:
                    path = file_info.get("path")
                    content = file_info.get("content", "")
                    if path:
                        zipf.writestr(path, content)
            elif isinstance(project_data, dict):
                for path, content in project_data.items():
                    zipf.writestr(path, str(content))

        public_url = f"/static/downloads/{filename}"
        
        # NOTE: We do NOT include the link in 'output' or 'execution_result' 
        # to avoid duplication with OutputRunner.
        return {
            "zip_url": public_url,
            "output": f"Project successfully bundled into {filename}.",
            "execution_result": "COMPRESSION_SUCCESS",
            "status": "success"
        }

    def _handle_extraction(self, state: Dict[str, Any]) -> Dict[str, Any]:
        return {"output": "Extraction mode not fully implemented.", "status": "warning"}
