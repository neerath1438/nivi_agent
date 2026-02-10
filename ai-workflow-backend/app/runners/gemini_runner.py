"""Gemini Config node runner."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner


class GeminiRunner(BaseRunner):
    """Runner for Gemini configuration node."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store Gemini configuration in state.
        
        This doesn't execute anything, just passes config to next node.
        """
        return {
            "provider": "gemini",
            "model": node_data.get("model", "gemini-2.5-flash"),
            "apiKey": node_data.get("apiKey", ""),
            "temperature": node_data.get("temperature", 0.7),
            "maxTokens": node_data.get("maxTokens", 1000),
            "output": "Gemini config ready"
        }
