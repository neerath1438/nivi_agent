"""WhatsApp Input node runner."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner


class WhatsAppInputRunner(BaseRunner):
    """Runner for WhatsApp Input node."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process WhatsApp input node.
        
        The input is already in state['input'], just pass it through.
        """
        user_input = state.get("input", "")
        sender = state.get("from", "")  # Phone number from WhatsApp webhook
        # Extract digits only or strip JID suffix
        phone_number = "".join(filter(str.isdigit, sender.split("@")[0])) if sender else ""
        
        print(f"\n📱 [WHATSAPP INPUT] Debug Info:")
        print(f"   - State keys: {list(state.keys())}")
        print(f"   - from field: {state.get('from')}")
        print(f"   - whatsapp_jid field: {state.get('whatsapp_jid')}")
        print(f"   - Extracted phone_number: {phone_number}")
        
        return {
            "whats_app_input": user_input,
            "input": user_input,
            "phone_number": phone_number
        }
