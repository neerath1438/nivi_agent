import cloudinary
import cloudinary.uploader
import logging
from app.config import settings

logger = logging.getLogger(__name__)

# Configure cloudinary
if settings.cloudinary_cloud_name:
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True
    )
else:
    logger.warning("⚠️ Cloudinary credentials not configured. File uploads will fail.")

def upload_file(file_path: str, folder: str = "ai-workflow"):
    """
    Uploads a file to Cloudinary and returns the secure URL.
    """
    if not settings.cloudinary_cloud_name:
        logger.error("❌ Cloudinary not configured. Skipping upload.")
        return None
        
    try:
        logger.info(f"☁️ Uploading {file_path} to Cloudinary folder: {folder}")
        response = cloudinary.uploader.upload(
            file_path, 
            folder=folder,
            resource_type="auto" # Handles both images and PDFs
        )
        return response.get("secure_url")
    except Exception as e:
        logger.error(f"❌ Cloudinary upload error: {str(e)}")
        return None
