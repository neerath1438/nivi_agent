import logging
from typing import Dict, Any
from app.services.whatsapp_service import whatsapp_service

logger = logging.getLogger(__name__)

class WhatsAppRunner:
    """Runner for sending messages via WhatsApp."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the WhatsApp output node.
        """
        message = state.get("output", "")
        # If output is empty, try llm_response
        if not message:
            message = state.get("llm_response", "")
            
        # print(f"📡 [DEBUG] WhatsAppRunner starting. Message length: {len(message)}")
        
        # If the flow was triggered by WhatsApp, the sender JID should be in state
        to = state.get("whatsapp_jid")
        # print(f"📡 [DEBUG] Target JID from state: {to}")
        
        # Fallback to node_data if present (for static recipients)
        if not to:
            to = node_data.get("phoneNumber")
            # print(f"📡 [DEBUG] Target JID from node_data: {to}")
            
        if not to or not message:
            # print(f"⚠️ [DEBUG] WhatsApp send failed: Missing recipient ({to}) or message (len: {len(message) if message else 0})")
            logger.warning(f"⚠️ WhatsApp send failed: Missing recipient ({to}) or message ({message})")
            return {"error": "Missing recipient or message"}

        # print(f"📤 [DEBUG] Sending WhatsApp message to {to} via service...")
        logger.info(f"📤 Sending WhatsApp message to {to}")
        success = whatsapp_service.send_message(to, message)
        
        # print(f"📡 [DEBUG] WhatsApp Service send result: {success}")
        if success:
            return {"whatsapp_sent": True}
        else:
            return {"error": "Failed to send WhatsApp message"}

# Global instance
whats_app_runner = WhatsAppRunner()
