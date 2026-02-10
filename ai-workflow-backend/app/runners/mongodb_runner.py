import logging
import json
import datetime
from typing import Dict, Any
from app.runners.base_runner import BaseRunner
from app.services.mongodb_service import mongodb_service

logger = logging.getLogger(__name__)

class MongoDBRunner(BaseRunner):
    """Runner for MongoDB node - supports FIND and INSERT operations."""
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        uri = node_data.get("uri")
        db_name = node_data.get("database")
        collection_name = node_data.get("collection")
        limit = int(node_data.get("limit", 10))
        operation = node_data.get("operation", "FIND").upper()
        user_input = state.get("input", "")
        
        # Fallback to localhost if URI is missing
        if not uri:
            uri = "mongodb://localhost:27017"
        
        if not all([uri, db_name, collection_name]):
            logger.warning("⚠️ MongoDB configuration incomplete")
            return {"error": "Incomplete MongoDB configuration"}
            
        print(f"🏢 [MONGODB RUNNER] DB: {db_name} | Coll: {collection_name} | Op: {operation}")
        print(f"📦 [MONGODB RUNNER] node_data: {json.dumps(node_data, indent=2)}")
        
        try:
            # Enhanced Helper to resolve {variable} or {{variable}} placeholders
            import re
            def resolve_text(text):
                if not isinstance(text, str):
                    return text
                
                # Replace both {var} and {{var}} patterns
                pattern = r'\{\{?(\w+)\}\}?'
                
                def replace_match(match):
                    var_name = match.group(1)
                    val = state.get(var_name)
                    if val is None:
                        # Try case-insensitive lookup
                        for k, v in state.items():
                            if k.lower() == var_name.lower():
                                return str(v)
                        return match.group(0) # Keep original if not found
                    return str(val)
                
                return re.sub(pattern, replace_match, text)

            def resolve_dict(target_obj):
                print(f"🧪 [MONGODB RUNNER] Resolving object type: {type(target_obj)}")
                if isinstance(target_obj, str) and target_obj.strip():
                    # If it's a string, first resolve placeholders, then try to parse as JSON
                    resolved_str = resolve_text(target_obj)
                    try:
                        return json.loads(resolved_str)
                    except Exception as e:
                        logger.error(f"❌ MongoDB JSON Parse Error: {str(e)} | Content: {resolved_str}")
                        print(f"❌ [MONGODB RUNNER] JSON Parse Error: {str(e)}")
                        return {} # Fail with empty dict if not valid JSON
                
                if not isinstance(target_obj, dict):
                    print(f"⚠️ [MONGODB RUNNER] Target is not a dict or string: {target_obj}")
                    return {}

                resolved = {}
                for k, v in target_obj.items():
                    if isinstance(v, str):
                        resolved[k] = resolve_text(v)
                    elif isinstance(v, dict):
                        resolved[k] = resolve_dict(v)
                    else:
                        resolved[k] = v
                return resolved

            if operation == "INSERT":
                # Check different possible keys for document data
                doc_raw = node_data.get("document") or node_data.get("data") or {}
                doc_to_insert = resolve_dict(doc_raw)
                
                if not doc_to_insert:
                    logger.error("❌ MongoDB INSERT: Empty document after resolution")
                    print(f"❌ [MONGODB RUNNER] INSERT failed: doc_raw was {doc_raw}")
                    return {"error": "No document data to insert"}
                
                # Auto-timestamp
                if "created_at" not in doc_to_insert:
                    doc_to_insert["created_at"] = datetime.datetime.now().isoformat()
                
                print(f"📥 [MONGODB RUNNER] Inserting document: {json.dumps(doc_to_insert)}")
                inserted_id = await mongodb_service.insert_data(uri, db_name, collection_name, doc_to_insert)
                
                return {
                    "mongodb_status": f"Successfully saved to {db_name}.{collection_name}",
                    "inserted_id": inserted_id,
                    "status": "success",
                    "operation": "INSERT"
                }

            if operation == "FIND":
                query_raw = node_data.get("query") or {}
                query = resolve_dict(query_raw)
                print(f"🔍 [MONGODB RUNNER] Searching with Query: {json.dumps(query)}")
                
                data = await mongodb_service.fetch_data(uri, db_name, collection_name, query)
                print(f"🔍 [MONGODB RUNNER] Database Result: {'Record Found' if data else 'No Record Found'}")
                if data:
                    print(f"🔍 [MONGODB RUNNER] Data Snippet: {str(data)[:100]}...")
                
                if not data:
                    return {"output": f"No matching data found in {db_name}.{collection_name}", "found": False}
                    
                return {"output": f"Found Record: {json.dumps(data, indent=2)}", "found": True, "data": data}

            # Default: FIND operation (this block is now redundant if operation is explicitly handled above)
            query = resolve_dict(node_data.get("query", {}))
            
            # Fallback legacy logic for keyword search if no explicit query provided
            if not query and user_input:
                stop_words = {"please", "give", "me", "the", "for", "link", "swiggy", "url", "what", "is", "of", "find", "show", "kudu", "venum", "solu", "enaku", "itey", "list", "name"}
                words = [w.strip("?,.!") for w in user_input.split()]
                keywords = [w for w in words if w.lower() not in stop_words and len(w) >= 2]
                if keywords:
                    fuzzy_keywords = ["\s*".join(list(k)) if len(k) <= 3 else k for k in keywords]
                    search_regex = "|".join(fuzzy_keywords)
                    query = {
                        "$or": [
                            {"name": {"$regex": search_regex, "$options": "i"}},
                            {"hotel_name": {"$regex": search_regex, "$options": "i"}},
                            {"phone_number": {"$regex": search_regex, "$options": "i"}}
                        ]
                    }

            results = await mongodb_service.fetch_data(uri, db_name, collection_name, query, limit)
            
            # Format context for next nodes
            context_str = ""
            if results:
                for doc in results:
                    # Clean _id for serialization
                    doc_copy = {k: str(v) if k == "_id" else v for k, v in doc.items()}
                    context_str += f"\nFound Record: {json.dumps(doc_copy, indent=1)}\n"
            else:
                context_str = f"No matching data found in {db_name}.{collection_name} for this search."
            
            return {
                "mongodb_data": results,
                "context": context_str,
                "mongodb_context": context_str,
                "found": len(results) > 0,
                "operation": "FIND"
            }
            
        except Exception as e:
            logger.error(f"❌ MongoDB Runner error: {str(e)}")
            return {"error": f"MongoDB Error: {str(e)}"}

# Global instance
mongo_db_runner = MongoDBRunner()
