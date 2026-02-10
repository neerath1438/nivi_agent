"""Claude Config node runner."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner


class ClaudeRunner(BaseRunner):
    """Runner for Claude configuration node."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store Claude configuration in state.
        
        This doesn't execute anything, just passes config to next node.
        """
        return {
            "provider": "claude",
            "model": node_data.get("model", "claude-3-5-sonnet-20241022"),
            "apiKey": node_data.get("apiKey", ""),
            "temperature": node_data.get("temperature", 0.7),
            "maxTokens": node_data.get("maxTokens", 1000),
            "output": "Claude config ready"
        }
