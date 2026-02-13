"""XPATH Helper node runner using lxml."""
import logging
from typing import Dict, Any, List
from lxml import html
from app.runners.base_runner import BaseRunner

logger = logging.getLogger(__name__)

class XPathHelperRunner(BaseRunner):
    """
    Runner that extracts data from HTML content using XPath expressions.
    """
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract data from HTML.
        Input can be from 'page_content' or 'output' or 'html_content'.
        """
        # Try to find HTML content in state
        html_content = state.get("page_content") or state.get("output") or state.get("html_content", "")
        
        if not html_content or not isinstance(html_content, str):
            logger.warning("XPathHelperRunner: No valid HTML content found in state.")
            return {"error": "No valid HTML content provided", "status": "error"}

        fields = node_data.get("fields", [])
        if not fields:
            logger.warning("XPathHelperRunner: No extraction fields defined.")
            return {"output": "No fields defined for extraction", "status": "success", "results": {}}

        try:
            tree = html.fromstring(html_content)
            results = {}
            
            for field in fields:
                name = field.get("name")
                xpath = field.get("xpath")
                mode = field.get("mode", "get") # Default to get for safety
                
                if not name or not xpath:
                    continue
                
                try:
                    # Execute XPath
                    elements = tree.xpath(xpath)
                    
                    extracted_values = []
                    for element in elements:
                        if isinstance(element, html.HtmlElement):
                            # Extract text content if it's an element
                            text = element.text_content().strip()
                            if text:
                                extracted_values.append(text)
                        else:
                            # It's a direct string extraction (e.g. @href)
                            val = str(element).strip()
                            if val:
                                extracted_values.append(val)
                    
                    # Handle Mode: Get (1 result) or Extract (All results)
                    if mode == "get":
                        results[name] = extracted_values[0] if extracted_values else ""
                    else:
                        # Extract mode (List)
                        results[name] = extracted_values
                        
                except Exception as e:
                    logger.error(f"Error extracting field '{name}' with XPath '{xpath}': {e}")
                    results[name] = f"Error: {str(e)}"

            # Prepare output
            import json
            output_msg = json.dumps(results, indent=2)
            
            # terminal_ui for visibility in the chat
            terminal_ui = (
                f"### 🔍 Extracted Data (XPATH)\n\n"
                f"```json\n{output_msg}\n```"
            )

            return {
                "output": output_msg,
                "results": results,
                "html_content": terminal_ui,
                "status": "success"
            }
                
        except Exception as e:
            logger.error(f"XPathHelperRunner Error: {str(e)}")
            return {"output": f"Extraction Error: {str(e)}", "status": "error"}

# Global instance for registration if needed or just class
xpath_helper_runner = XPathHelperRunner()
