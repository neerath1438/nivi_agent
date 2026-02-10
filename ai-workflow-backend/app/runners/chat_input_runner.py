"""Chat Input node runner."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner


class ChatInputRunner(BaseRunner):
    """Runner for Chat Input node."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process chat input node.
        
        The input is already in state['input'], just pass it through.
        """
        user_input = state.get("input", "")
        print(f"💬 Chat Input: {user_input}")
        
        return {
            "chat_input": user_input,
            "output": user_input
        }
