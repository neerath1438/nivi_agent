import os
import sys
import cloudinary
import cloudinary.api
from dotenv import load_dotenv

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

# Configure
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def list_data():
    print("\n🔍 Listing Cloudinary Resources...")
    try:
        # List resources in our specific folders
        result = cloudinary.api.resources(type="upload", prefix="ai-workflow")
        resources = result.get("resources", [])
        
        if not resources:
            print("📭 No resources found in 'ai-workflow' folder.")
            return []
            
        print(f"📊 Found {len(resources)} resources:")
        for res in resources:
            print(f"  - [{res['resource_type']}] {res['public_id']} -> {res['secure_url']}")
        return resources
    except Exception as e:
        print(f"❌ Error listing resources: {str(e)}")
        return []

def clear_data():
    print("\n⚠️  Preparing to Clear Cloudinary Data...")
    resources = list_data()
    
    if not resources:
        print("⏭️ Nothing to delete.")
        return

    confirm = input("\n🔥 Are you sure you want to DELETE ALL resources listed above? (yes/no): ")
    
    if confirm.lower() == 'yes':
        try:
            public_ids = [res['public_id'] for res in resources]
            print(f"🗑️ Deleting {len(public_ids)} resources...")
            
            # Use chunks for deletion if there are many files
            cloudinary.api.delete_resources(public_ids)
            print("✅ All resources cleared successfully.")
        except Exception as e:
            print(f"❌ Error during deletion: {str(e)}")
    else:
        print("🚫 Deletion cancelled.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "clear":
            clear_data()
        elif sys.argv[1] == "list":
            list_data()
        else:
            print("Usage: python manage_cloudinary.py [list|clear]")
    else:
        # Default action
        list_data()
        print("\n💡 Hint: Run 'python manage_cloudinary.py clear' to delete files.")
