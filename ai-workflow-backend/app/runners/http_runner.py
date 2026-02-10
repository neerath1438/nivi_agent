import requests
import json
from typing import Dict, Any
from app.runners.base_runner import BaseRunner

class HttpRunner(BaseRunner):
    """Runner for making HTTP API requests."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        url = node_data.get("url", "")
        method = node_data.get("method", "GET").upper()
        headers_str = node_data.get("headers", "{}")
        body_str = node_data.get("body", "{}")
        
        if not url:
            return {"error": "No URL provided", "output": "HTTP Error: No URL"}
            
        try:
            # Parse headers and body
            headers = json.loads(headers_str) if headers_str else {}
            
            # Replace {input} in URL or Body
            user_input = state.get("input", "")
            url = url.replace("{input}", str(user_input))
            body_str = body_str.replace("{input}", str(user_input))
            
            print(f"🌐 HTTP {method} -> {url}")
            
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=10)
            elif method == "POST":
                body = json.loads(body_str) if body_str else {}
                response = requests.post(url, headers=headers, json=body, timeout=10)
            else:
                return {"error": f"Method {method} not supported"}
                
            response.raise_for_status()
            
            try:
                result_data = response.json()
            except:
                result_data = response.text
                
            return {
                "http_response": result_data,
                "output": str(result_data),
                "status_code": response.status_code
            }
            
        except Exception as e:
            print(f"❌ HTTP Error: {str(e)}")
            return {
                "error": str(e),
                "output": f"HTTP Request failed: {str(e)}"
            }
