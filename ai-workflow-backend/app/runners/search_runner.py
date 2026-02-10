from typing import Dict, Any
from app.runners.base_runner import BaseRunner
from app.services.gemini_service import GeminiService

class SearchRunner(BaseRunner):
    """Runner for Google Search node using Gemini grounding."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute search using Gemini's google_search tool.
        """
        # Get query from node data or fallback to state input
        query_template = node_data.get("query", "{input}")
        user_input = state.get("input", "")
        
        query = query_template.replace("{input}", user_input)
        
        print(f"🔍 Executing Google Search grounding for: {query}")
        
        try:
            # Use Gemini with search enabled
            service = GeminiService()
            response = service.generate_text(
                prompt=f"Search for and provide detailed information about: {query}",
                use_search=True, # Enable grounding
                model="gemini-2.0-flash"
            )
            
            search_results = response["text"]
            
            print(f"✅ Search completed. Result length: {len(search_results)} chars")
            
            return {
                "search_results": search_results,
                "output": search_results,
                "query": query
            }
        except Exception as e:
            print(f"❌ Search Error: {str(e)}")
            return {
                "error": str(e),
                "output": f"Failed to perform search: {str(e)}"
            }
