import json
from typing import Dict, Any, List
from jsonpath_ng import jsonpath, parse
from app.runners.base_runner import BaseRunner

class JSONPathRunner(BaseRunner):
    """Runner for extracting data from JSON using JSONPath."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        # Input JSON data
        data_source = state.get("extracted_data") or state.get("output")
        fields = node_data.get("fields", [])
        
        if not data_source:
            return {"status": "error", "output": "No JSON data found to extract from."}
            
        # Ensure it's a dict/list
        if isinstance(data_source, str):
            try:
                data_source = json.loads(data_source)
            except:
                return {"status": "error", "output": "Input is not a valid JSON string."}
        
        results = {}
        
        try:
            for field in fields:
                name = field.get("name")
                path = field.get("path")
                mode = field.get("mode", "get")
                
                if not name or not path:
                    continue
                
                try:
                    # Parse JSONPath
                    jsonpath_expression = parse(path)
                    matches = [match.value for match in jsonpath_expression.find(data_source)]
                    
                    # Handle Mode: Get (1 result) or Extract (All results)
                    if mode == "get":
                        results[name] = matches[0] if matches else ""
                    else:
                        results[name] = matches
                        
                except Exception as e:
                    results[name] = f"Error: {str(e)}"
                    
            return {
                "status": "success",
                "extracted_data": results,
                "output": f"Successfully extracted {len(results)} fields using JSONPath."
            }
            
        except Exception as e:
            return {"status": "error", "output": f"JSONPath processing error: {str(e)}"}
