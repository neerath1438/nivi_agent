from typing import Dict, Any, List
from lxml import html
from app.runners.base_runner import BaseRunner

class CSSSelectorRunner(BaseRunner):
    """Runner for extracting data from HTML using CSS Selectors."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        # Input HTML content
        html_content = state.get("page_content") or state.get("output") or ""
        fields = node_data.get("fields", [])
        
        if not html_content:
            return {"status": "error", "output": "No HTML content found to extract from."}
            
        results = {}
        
        try:
            tree = html.fromstring(html_content)
            
            for field in fields:
                name = field.get("name")
                selector = field.get("selector")
                mode = field.get("mode", "get")
                
                if not name or not selector:
                    continue
                
                try:
                    # Execute CSS Selector
                    elements = tree.cssselect(selector)
                    
                    extracted_values = []
                    for element in elements:
                        # Extract text content
                        text = element.text_content().strip()
                        if text:
                            extracted_values.append(text)
                    
                    # Handle Mode: Get (1 result) or Extract (All results)
                    if mode == "get":
                        results[name] = extracted_values[0] if extracted_values else ""
                    else:
                        results[name] = extracted_values
                        
                except Exception as e:
                    results[name] = f"Error: {str(e)}"
                    
            return {
                "status": "success",
                "extracted_data": results,
                "output": f"Successfully extracted {len(results)} fields using CSS Selectors."
            }
            
        except Exception as e:
            return {"status": "error", "output": f"Failed to parse HTML: {str(e)}"}
