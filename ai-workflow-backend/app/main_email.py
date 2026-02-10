"""Email Agent - Deployment Entry Point for Railway."""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api import email_api

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app for Email Agent only
app = FastAPI(
    title="Email Agent API",
    description="Microservice for AI-powered email generation and sending",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register ONLY email router
app.include_router(email_api.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "Email Agent",
        "message": "AI-powered email generation and sending service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "service": "email_agent",
        "status": "healthy",
        "deployed": True
    }


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
