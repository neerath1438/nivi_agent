"""Elasticsearch service for querying indices."""
import logging
from typing import Dict, Any, List, Optional
from elasticsearch import Elasticsearch
from app.config import settings

logger = logging.getLogger(__name__)


class ElasticsearchService:
    """Service for interacting with Elasticsearch."""
    
    def __init__(self):
        """Initialize Elasticsearch client."""
        # print(f"🔧 Initializing Elasticsearch Service...")
        # print(f"   Scheme: {settings.elasticsearch_scheme}")
        # print(f"   Host: {settings.elasticsearch_host}")
        # print(f"   Port: {settings.elasticsearch_port}")
        # print(f"   Username: {settings.elasticsearch_username or '(none)'}")
        # print(f"   Password: {'***' if settings.elasticsearch_password else '(none)'}")
        # print(f"   Verify Certs: {settings.elasticsearch_verify_certs}")
        # print(f"   Default Index: {settings.elasticsearch_index}")
        
        # Build connection parameters
        es_config = {
            "hosts": [{
                "host": settings.elasticsearch_host,
                "port": settings.elasticsearch_port,
                "scheme": settings.elasticsearch_scheme
            }]
        }
        
        # Add authentication if provided
        if settings.elasticsearch_username and settings.elasticsearch_password:
            es_config["basic_auth"] = (
                settings.elasticsearch_username,
                settings.elasticsearch_password
            )
            print(f"   [AUTH] Using basic authentication")
        
        # SSL verification settings
        if settings.elasticsearch_scheme == "https":
            es_config["verify_certs"] = settings.elasticsearch_verify_certs
            if not settings.elasticsearch_verify_certs:
                es_config["ssl_show_warn"] = False
                print(f"   [WARN] SSL certificate verification disabled")
        
        self.client = Elasticsearch(**es_config)
        self.default_index = settings.elasticsearch_index
    
    def search(
        self,
        query: str,
        index: Optional[str] = None,
        size: int = 10
    ) -> Dict[str, Any]:
        """
        Execute a search query against Elasticsearch.
        
        Args:
            query: Search query string
            index: Index to search (defaults to config index)
            size: Number of results to return
        
        Returns:
            Dict containing search results
        """
        try:
            index = index or self.default_index
            
            logger.info(f"Searching Elasticsearch index: {index}, query: {query}")
            
            # Build a simple match query
            search_body = {
                "query": {
                    "multi_match": {
                        "query": query,
                        "fields": ["*"],
                        "type": "best_fields"
                    }
                },
                "size": size
            }
            
            response = self.client.search(index=index, body=search_body)
            
            hits = response.get("hits", {}).get("hits", [])
            
            results = {
                "total": response.get("hits", {}).get("total", {}).get("value", 0),
                "results": [
                    {
                        "id": hit["_id"],
                        "score": hit["_score"],
                        "source": hit["_source"]
                    }
                    for hit in hits
                ]
            }
            
            logger.info(f"Elasticsearch returned {results['total']} results")
            
            return results
            
        except Exception as e:
            logger.error(f"Elasticsearch error: {str(e)}")
            # Return empty results if ES is not available
            return {
                "total": 0,
                "results": [],
                "error": str(e)
            }
    
    def health_check(self) -> bool:
        """Check if Elasticsearch is available."""
        try:
            print(f"\n[CONN] Checking Elasticsearch Connection...")
            print(f"   URL: {settings.elasticsearch_url}")
            
            ping_result = self.client.ping()
            
            if ping_result:
                # Get cluster info for detailed status
                info = self.client.info()
                print(f"[OK] Elasticsearch Connected!")
                print(f"   Cluster: {info.get('cluster_name', 'Unknown')}")
                print(f"   Version: {info.get('version', {}).get('number', 'Unknown')}")
                
                # Check if default index exists
                try:
                    if self.client.indices.exists(index=self.default_index):
                        count_result = self.client.count(index=self.default_index)
                        doc_count = count_result.get('count', 0)
                        print(f"   Index '{self.default_index}': {doc_count} documents")
                    else:
                        print(f"[WARN] Index '{self.default_index}' does not exist")
                except Exception as idx_error:
                    print(f"[WARN] Could not check index: {str(idx_error)}")
                
                return True
            else:
                print(f"[FAIL] Elasticsearch ping failed")
                return False
                
        except Exception as e:
            print(f"[ERR] Elasticsearch Connection Error:")
            print(f"   Error Type: {type(e).__name__}")
            print(f"   Error Message: {str(e)}")
            print(f"   URL: {settings.elasticsearch_url}")
            print(f"\n[INFO] Troubleshooting:")
            print(f"   1. Check if Elasticsearch is running")
            print(f"   2. Verify ELASTICSEARCH_URL in .env file")
            print(f"   3. Check network connectivity")
            logger.error(f"Elasticsearch health check failed: {str(e)}")
            return False


# Global service instance
elasticsearch_service = ElasticsearchService()
