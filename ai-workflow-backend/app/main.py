import logging
import warnings
import asyncio
import sys

# Windows Subprocess Support (Required for Playwright)
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import init_db
from app.api.flow_api import router
from app.api import code_api, email_api, knowledge_api, whatsapp_api, terminal_api
from app.api.credentials_api import router as credentials_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Restore to INFO for debugging
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Silence specific loggers
for logger_name in [
    'sqlalchemy.engine', 
    'sqlalchemy.pool', 
    'uvicorn.access', 
    'uvicorn.error', 
    'httpx', 
    'app.api.whatsapp_api',
    'app.services.whatsapp_service',
    'app.services.mongodb_service'
]:
    logging.getLogger(logger_name).setLevel(logging.ERROR)

# Suppress Google API Core FutureWarnings
warnings.filterwarnings("ignore", category=FutureWarning, module="google.api_core")

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AI Workflow Builder API",
    description="Backend API for drag-and-drop AI workflow builder",
    version="1.0.0",
    docs_url="/docs",  # Enable Swagger UI
    redoc_url="/redoc"  # Enable ReDoc UI
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Register routers (Prefixes are handled within individual router files)
app.include_router(router)
app.include_router(code_api.router)
app.include_router(email_api.router)
app.include_router(knowledge_api.router)
app.include_router(credentials_router)
app.include_router(whatsapp_api.router)
app.include_router(terminal_api.router)

# Mount static files for PDF downloads
os.makedirs("static/downloads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()
    
    # 🚀 Professional Clean Startup UI
    print("\n" + "="*50)
    print("🚀  AI WORKFLOW BACKEND IS READY!")
    print(f"📡  Listening on: http://0.0.0.0:8000")
    print("🤖  Systems: WhatsApp Bridge, OpenAI, MongoDB")
    print("✨  Terminal is Silenced for a Clean Experience.")
    print("="*50 + "\n")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI Workflow Builder API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
