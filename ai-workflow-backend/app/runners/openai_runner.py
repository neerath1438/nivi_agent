"""OpenAI Config node runner."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner


class OpenAIRunner(BaseRunner):
    """Runner for OpenAI configuration node."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store OpenAI configuration in state.
        
        This doesn't execute anything, just passes config to next node.
        """
        return {
            "provider": "openai",
            "model": node_data.get("model", "gpt-4o-mini"),
            "apiKey": node_data.get("apiKey", ""),
            "temperature": node_data.get("temperature", 0.7),
            "maxTokens": node_data.get("maxTokens", 1000),
            "output": "OpenAI config ready"
        }
