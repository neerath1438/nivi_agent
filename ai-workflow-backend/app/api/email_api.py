from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

router = APIRouter(prefix="/api/email", tags=["Email"])
logger = logging.getLogger(__name__)

class EmailRequest(BaseModel):
    to: str
    cc: str = ""
    subject: str
    body: str

from app.config import settings

@router.post("/send")
async def send_email(request: EmailRequest):
    smtp_server = settings.smtp_server
    smtp_port = settings.smtp_port
    smtp_user = settings.smtp_user
    smtp_pass = settings.smtp_password

    if not all([smtp_server, smtp_user, smtp_pass]):
        raise HTTPException(status_code=500, detail="SMTP credentials not configured in backend .env")

    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = request.to
        if request.cc:
            msg['Cc'] = request.cc
        msg['Subject'] = request.subject

        msg.attach(MIMEText(request.body, 'plain'))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            recipients = [request.to]
            if request.cc:
                recipients.append(request.cc)
            server.sendmail(smtp_user, recipients, msg.as_string())

        return {"status": "success", "message": f"Email sent successfully to {request.to}"}
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
