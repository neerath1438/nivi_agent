import os
from typing import Dict, Any
from app.runners.base_runner import BaseRunner
from app.services.extraction_engine import ExtractionEngine

STORAGE_DIR = "storage/knowledge"

class KnowledgeRunner(BaseRunner):
    """Runner for extracting context from Knowledge Base files."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        file_id = node_data.get("file_id", "")
        
        if not file_id:
            # If no file selected in node, try to find the latest uploaded file
            if os.path.exists(STORAGE_DIR) and os.listdir(STORAGE_DIR):
                files = os.listdir(STORAGE_DIR)
                files.sort(key=lambda x: os.path.getmtime(os.path.join(STORAGE_DIR, x)), reverse=True)
                file_id = files[0]
            else:
                return {"error": "No files found in Knowledge Base", "output": "Knowledge Base is empty."}
        
        # Resolve full path if only ID/prefix provided
        file_path = ""
        if os.path.exists(os.path.join(STORAGE_DIR, file_id)):
            file_path = os.path.join(STORAGE_DIR, file_id)
        else:
            for filename in os.listdir(STORAGE_DIR):
                if filename.startswith(file_id):
                    file_path = os.path.join(STORAGE_DIR, filename)
                    break
                    
        if not file_path:
            return {"error": f"File {file_id} not found", "output": "Knowledge file not found."}
            
        print(f"📖 Extracting data from Knowledge File: {file_path}")
        extracted_content = ExtractionEngine.extract_text(file_path)
        
        # If it's a PDF and text is empty, Gemini multimodal will handle it later in LLM node
        # But we still pass the text we found.
        
        return {
            "knowledge_context": extracted_content,
            "output": extracted_content, # Pass the raw data to LLM node
            "file_path": file_path
        }
