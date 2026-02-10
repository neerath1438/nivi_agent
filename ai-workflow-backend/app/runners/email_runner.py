import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

async def run(node_id: str, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Email Runner
    
    This runner handles two things:
    1. Preparing a draft 'result' for the Chat UI.
    2. (Optional) Directly sending if requested, though we prefer the interactive flow.
    """
    logger.info(f"Running Email Node: {node_id}")
    
    # Get content from state
    # LLM nodes typically put their result in 'output'
    email_body = state.get("output", "")
    
    # Fallback to other possible keys if 'output' is empty
    if not email_body:
        email_body = state.get("response", "")
    if not email_body and state.get("messages"):
        email_body = state.get("messages")[-1].get("content", "")
        
    to_email = node_data.get("to_email", "")
    cc_email = node_data.get("cc_email", "")
    subject = node_data.get("subject", "Automated Email from AI Workflow")
    
    # Return a special structure that the ChatInterface will recognize
    return {
        "type": "email_draft",
        "data": {
            "to": to_email,
            "cc": cc_email,
            "subject": subject,
            "body": email_body,
            "node_id": node_id
        },
        "message": "Email draft prepared. Please review and send from the chat window."
    }
