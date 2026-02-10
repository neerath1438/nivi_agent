"""T-Shirt catalog runner - handles one-time link delivery using MongoDB."""
from typing import Dict, Any
from app.services.prompts import TSHIRT_CATALOG_PROMPT
from app.runners.mongodb_runner import mongo_db_runner

class TShirtCatalogRunner:
    """Runner for T-shirt catalog bot with one-time reply logic using MongoDB."""
    
    def __init__(self):
        self.company_name = "Your T-Shirt Brand"
        self.catalog_link = "https://yourtshirtcompany.com/catalog"
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Check link status in MongoDB and return catalog if new."""
        company_name = node_data.get("company_name", self.company_name)
        catalog_link = node_data.get("catalog_link", self.catalog_link)
        phone_number = state.get("phone_number")
        
        print(f"\n🔍 [T-SHIRT CATALOG] Running for: {phone_number}")
        print(f"🏢 [T-SHIRT CATALOG] Company: {company_name}")
        print(f"🔗 [T-SHIRT CATALOG] Link: {catalog_link}")
        
        if not phone_number:
            return {"output": "", "error": "No phone number", "silent": True}

        # 1. Use the shared mongo_db_runner to check for existing record
        # Note: We use the same DB/Collection as the main bot logic
        mongodb_data = {
            "operation": "FIND",
            "database": "SK_sports_Wear",
            "collection": "customers_records",
            "query": {"phone_number": phone_number}
        }
        
        try:
            search_result = await mongo_db_runner.run(mongodb_data, state)
            already_sent = "Found Record:" in search_result.get("output", "")
            
            print(f"📊 [T-SHIRT CATALOG] DB Result: {'EXISTING' if already_sent else 'NEW'}")

            if already_sent:
                print(f"🔕 [T-SHIRT CATALOG] SILENCING - Customer already tracked.")
                return {
                    "output": "",
                    "silent": True,
                    "company_name": company_name,
                    "catalog_link": catalog_link
                }
            
            # 2. First time - Prepare catalog
            catalog_message = TSHIRT_CATALOG_PROMPT.format(
                company_name=company_name,
                catalog_link=catalog_link
            )
            
            print(f"🎉 [T-SHIRT CATALOG] First time customer! Preparing catalog.")
            
            return {
                "output": catalog_message,
                "silent": False,
                "company_name": company_name,
                "catalog_link": catalog_link
            }
            
        except Exception as e:
            print(f"❌ [T-SHIRT CATALOG] MongoDB Error: {e}")
            return {"output": "", "error": str(e), "silent": True}

tshirt_catalog_runner = TShirtCatalogRunner()
