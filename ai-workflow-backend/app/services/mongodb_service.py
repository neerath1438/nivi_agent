import logging
import motor.motor_asyncio
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

class MongoDBService:
    def __init__(self):
        self.clients = {}

    def get_client(self, uri: str):
        if uri not in self.clients:
            logger.info(f"🔗 Connecting to MongoDB: {uri[:15]}...")
            self.clients[uri] = motor.motor_asyncio.AsyncIOMotorClient(uri)
        return self.clients[uri]

    async def insert_data(
        self,
        uri: str,
        db_name: str,
        collection_name: str,
        document: Dict[str, Any]
    ) -> str:
        """Insert a document into a collection."""
        try:
            client = self.get_client(uri)
            db = client[db_name]
            collection = db[collection_name]
            
            logger.info(f"📥 Inserting into MongoDB: {db_name}.{collection_name}")
            result = await collection.insert_one(document)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"❌ MongoDB Insert Error: {str(e)}")
            raise e

    async def fetch_data(
        self, 
        uri: str, 
        db_name: str, 
        collection_name: str, 
        query: Dict[str, Any] = None, 
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Fetch documents from a collection based on a query."""
        try:
            client = self.get_client(uri)
            db = client[db_name]
            collection = db[collection_name]
            
            query = query or {}
            logger.info(f"🔍 Querying MongoDB: {db_name}.{collection_name} | Query: {query} | Limit: {limit}")
            
            cursor = collection.find(query).limit(limit)
            results = await cursor.to_list(length=limit)
            
            # Clean up ObjectId if present for JSON serialization
            for doc in results:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                    
            return results
        except Exception as e:
            logger.error(f"❌ MongoDB Error: {str(e)}")
            raise e

# Global instance
mongodb_service = MongoDBService()
