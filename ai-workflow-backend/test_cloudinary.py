import os
import sys
from dotenv import load_dotenv

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from app.utils.cloudinary_utils import upload_file

def run_test():
    print("🚀 Cloudinary Upload Test Starting...")
    
    # Create a small dummy file for testing
    test_file = "cloudinary_test_image.txt"
    with open(test_file, "w") as f:
        f.write("This is a test file for Cloudinary integration.")
    
    print(f"📄 Temporary file created: {test_file}")
    
    try:
        # Test upload
        url = upload_file(test_file, folder="test_folder")
        
        if url:
            print(f"✅ SUCCESS! File uploaded to Cloudinary.")
            print(f"🔗 URL: {url}")
        else:
            print("❌ FAILURE: Upload returned None. Check your .env credentials and internet connection.")
            
    finally:
        # Cleanup
        if os.path.exists(test_file):
            os.remove(test_file)
            print(f"🗑️ Temporary file {test_file} removed from local disk.")

if __name__ == "__main__":
    run_test()
