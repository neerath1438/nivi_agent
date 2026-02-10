"""Elasticsearch node runner with query plan execution."""
import json
import logging
from typing import Dict, Any
from app.runners.base_runner import BaseRunner
from app.services.elasticsearch_service import ElasticsearchService
from app.services.schema_loader import get_schema_loader

logger = logging.getLogger(__name__)


class ElasticsearchRunner(BaseRunner):
    """Runner for Elasticsearch node - executes query plans."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute Elasticsearch query from LLM-generated plan.
        
        Expects LLM to have generated a structured JSON plan.
        """
        # Get query plan from LLM response
        llm_response = state.get("llm_response", state.get("output", ""))
        
        if not llm_response:
            return {
                "search_results": "No query plan provided",
                "output": "No query plan found",
                "hits": []
            }
        
        # Get ES configuration from node data
        # Check both 'index' and 'indexName' for compatibility
        index_name = node_data.get("index") or node_data.get("indexName")
        if not index_name:
            # Import settings to get default index
            from app.config import settings
            index_name = settings.elasticsearch_index
        
        max_results = node_data.get("maxResults") or node_data.get("size", 5)
        
        print(f"🔍 Elasticsearch Node Configuration:")
        print(f"   Index from node_data: {node_data.get('index')} (using: {index_name})")
        print(f"   Max results: {max_results}")
        
        try:
            # Parse query plan from LLM
            plan = self._parse_query_plan(llm_response)
            
            print(f"🔍 Elasticsearch Query Plan:")
            print(f"   {json.dumps(plan, indent=2)}")
            
            # Convert plan to Elasticsearch DSL
            es_query = self._build_es_query(plan, max_results)
            
            print(f"📊 Elasticsearch DSL Query:")
            print(f"   Index: {index_name}")
            print(f"   {json.dumps(es_query, indent=2)[:500]}...")
            
            logger.info(f"📊 Executing ES query: {json.dumps(es_query, indent=2)}")
            
            # Initialize Elasticsearch service
            es_service = ElasticsearchService()
            
            # Check if ES is healthy
            if not es_service.health_check():
                print(f"⚠️ Elasticsearch health check failed")
                return {
                    "search_results": "Elasticsearch not available",
                    "output": "Search service unavailable",
                    "hits": []
                }
            
            # Execute search using the raw query method
            results = es_service.client.search(index=index_name, body=es_query)
            
            total_hits = results.get("hits", {}).get("total", {}).get("value", 0)
            print(f"✅ Elasticsearch Results: {total_hits} hits")
            
            # Format results based on operation type
            formatted_output = self._format_results(plan, results)
            
            print(f"📄 Formatted Results ({len(formatted_output)} chars):")
            print(f"   {formatted_output[:300]}{'...' if len(formatted_output) > 300 else ''}")
            
            return {
                "search_results": formatted_output,
                "output": formatted_output,
                "raw_results": results,
                "total": total_hits
            }
            
        except Exception as e:
            error_msg = f"Elasticsearch error: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return {
                "search_results": error_msg,
                "output": error_msg,
                "hits": [],
                "error": str(e)
            }
    
    def _parse_query_plan(self, llm_response: str) -> Dict[str, Any]:
        """Parse JSON query plan from LLM response"""
        try:
            # Remove markdown if present
            if "```" in llm_response:
                import re
                match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', llm_response, re.DOTALL)
                if match:
                    llm_response = match.group(1).strip()
            
            plan = json.loads(llm_response)
            return plan
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse query plan: {e}")
            # Return default plan
            return {"operation": "AGGREGATION", "metric": "COUNT", "filters": {}}
    
    def _build_es_query(self, plan: Dict[str, Any], max_results: int) -> Dict[str, Any]:
        """Convert structured plan to Elasticsearch DSL"""
        operation = plan.get("operation", "AGGREGATION")
        metric = plan.get("metric", "COUNT")
        filters = plan.get("filters", {})
        group_by = plan.get("group_by")
        
        # Build filter clauses
        must_clauses = []
        
        print(f"\n🔍 Building ES Query from Plan:")
        print(f"   Operation: {operation}")
        print(f"   Filters: {filters}")
        
        for field_name, filter_config in filters.items():
            filter_type = filter_config.get("type", "term")
            
            print(f"   Processing filter: {field_name} = {filter_config}")
            
            if filter_type == "range":
                must_clauses.append({
                    "range": {
                        field_name: {
                            "gte": filter_config.get("from"),
                            "lte": filter_config.get("to")
                        }
                    }
                })
            elif filter_type == "term":
                filter_value = filter_config.get("value")
                
                # City, status, and similar categorical fields should use match query
                # for analyzed fields, or term query for keyword fields
                # To be safe, use match query with operator AND for exact phrase matching
                if field_name in ["city", "status", "property_type", "country"]:
                    print(f"   → Adding MATCH filter (exact): {field_name} = '{filter_value}'")
                    must_clauses.append({
                        "match": {
                            field_name: {
                                "query": filter_value,
                                "operator": "and"
                            }
                        }
                    })
                else:
                    # For true keyword fields (IDs, postcodes), use term query
                    print(f"   → Adding TERM filter: {field_name} = '{filter_value}'")
                    must_clauses.append({
                        "term": {field_name: filter_value}
                    })
            elif filter_type == "match":
                must_clauses.append({
                    "match": {field_name: filter_config.get("value")}
                })
        
        # Build query
        if operation == "AGGREGATION":
            query = {
                "size": 0,  # Don't return documents for aggregations
                "query": {
                    "bool": {
                        "must": must_clauses if must_clauses else [{"match_all": {}}]
                    }
                }
            }
            
            # Add aggregation
            if group_by:
                query["aggs"] = {
                    "grouped": {
                        "terms": {
                            "field": group_by,
                            "size": 100
                        }
                    }
                }
        else:  # SEARCH
            query = {
                "size": max_results,
                "query": {
                    "bool": {
                        "must": must_clauses if must_clauses else [{"match_all": {}}]
                    }
                }
            }
        
        return query
    
    def _format_results(self, plan: Dict[str, Any], results: Dict[str, Any]) -> str:
        """Format ES results as readable text"""
        operation = plan.get("operation", "AGGREGATION")
        
        if operation == "AGGREGATION":
            # Check for aggregations
            if "aggregations" in results:
                buckets = results["aggregations"].get("grouped", {}).get("buckets", [])
                if buckets:
                    # Grouped aggregation
                    output = "Results:\n\n"
                    for bucket in buckets:
                        output += f"- {bucket['key']}: {bucket['doc_count']}\n"
                    return output
            
            # Simple count
            total = results.get("hits", {}).get("total", {}).get("value", 0)
            return f"Total count: {total}"
        
        else:  # SEARCH
            hits = results.get("hits", {}).get("hits", [])
            if not hits:
                return "No results found"
            
            output = f"Found {len(hits)} results:\n\n"
            for i, hit in enumerate(hits, 1):
                source = hit.get("_source", {})
                output += f"{i}. "
                for key, value in source.items():
                    output += f"{key}: {value}, "
                output = output.rstrip(", ") + "\n"
            
            return output
