"""
Property Management Schema Loader
Loads Elasticsearch schema from mappings
"""
from typing import Dict, List

# Property schema - Complete mapping based on actual data
PROPERTIES_MAPPING = {
    "properties": {
        # Core IDs
        "property_id": {"type": "keyword"},
        "tenant_id": {"type": "keyword"},
        
        # Address fields
        "address": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
        "address_line_2": {"type": "text"},
        "city": {"type": "keyword"},
        "county": {"type": "keyword"},
        "postcode": {"type": "keyword"},
        "country": {"type": "keyword"},
        
        # Property details
        "property_type": {"type": "keyword"},
        "ownership_type": {"type": "keyword"},
        "bedrooms": {"type": "integer"},
        "bathrooms": {"type": "integer"},
        "total_floor_area": {"type": "float"},
        "year_built": {"type": "integer"},
        
        # Multi-unit properties
        "is_multi_unit": {"type": "boolean"},
        "total_units": {"type": "integer"},
        
        # Financial
        "purchase_date": {"type": "date"},
        "purchase_price": {"type": "float"},
        "current_value": {"type": "float"},
        "mortgage_amount": {"type": "float"},
        "mortgage_provider": {"type": "keyword"},
        
        # Compliance
        "council_tax_band": {"type": "keyword"},
        "epc_rating": {"type": "keyword"},
        "epc_expiry_date": {"type": "date"},
        
        # Amenities
        "parking_spaces": {"type": "integer"},
        "has_garden": {"type": "boolean"},
        "has_garage": {"type": "boolean"},
        "furnished_status": {"type": "keyword"},
        
        # Status and metadata
        "status": {"type": "keyword"},  # active/inactive
        "notes": {"type": "text"},
        "created_at": {"type": "date"},
        "updated_at": {"type": "date"},
        "created_by": {"type": "integer"},
        "updated_by": {"type": "integer"}
    }
}


class SchemaLoader:
    """Load schemas from Elasticsearch mappings"""
    
    def __init__(self):
        """Initialize with property schema"""
        self.mapping = PROPERTIES_MAPPING
        self.schema = self._load_schema_from_mapping(PROPERTIES_MAPPING)
    
    def _load_schema_from_mapping(self, mapping: Dict) -> Dict[str, Dict[str, str]]:
        """Extract field names and types from mapping"""
        schema = {}
        properties = mapping.get("properties", {})
        
        for field_name, field_config in properties.items():
            field_type = field_config.get("type", "unknown")
            
            schema[field_name] = {
                "type": field_type,
                "searchable": field_type in ["text", "keyword"],
                "aggregatable": field_type in ["keyword", "integer", "float", "date", "boolean"]
            }
            
            # Check for .keyword subfield
            if "fields" in field_config and "keyword" in field_config["fields"]:
                schema[field_name]["has_keyword"] = True
                schema[field_name]["keyword_field"] = f"{field_name}.keyword"
        
        return schema
    
    def get_schema_context(self) -> str:
        """Get human-readable schema for LLM prompts"""
        lines = ["Available Fields in properties index:", ""]
        
        # Group by type
        date_fields = []
        keyword_fields = []
        numeric_fields = []
        text_fields = []
        
        for field_name, field_info in self.schema.items():
            field_type = field_info["type"]
            
            if field_type == "date":
                date_fields.append(field_name)
            elif field_type == "keyword":
                keyword_fields.append(field_name)
            elif field_type in ["integer", "float"]:
                numeric_fields.append(field_name)
            elif field_type == "text":
                text_fields.append(field_name)
        
        if date_fields:
            lines.append("📅 Date Fields:")
            for f in date_fields:
                lines.append(f"  - {f}")
            lines.append("")
        
        if keyword_fields:
            lines.append("🏷️ Keyword Fields:")
            for f in keyword_fields:
                lines.append(f"  - {f}")
            lines.append("")
        
        if numeric_fields:
            lines.append("🔢 Numeric Fields:")
            for f in numeric_fields:
                lines.append(f"  - {f}")
            lines.append("")
        
        if text_fields:
            lines.append("📝 Text Fields:")
            for f in text_fields:
                keyword_info = " (.keyword available)" if self.schema[f].get("has_keyword") else ""
                lines.append(f"  - {f}{keyword_info}")
            lines.append("")
        
        return "\n".join(lines)
    
    def is_valid_field(self, field_name: str) -> bool:
        """Check if field exists in schema"""
        return field_name in self.schema
    
    def get_aggregatable_fields(self) -> List[str]:
        """Get fields that can be used in aggregations"""
        return [
            field_name 
            for field_name, field_info in self.schema.items()
            if field_info.get("aggregatable", False)
        ]
    
    def get_searchable_fields(self) -> List[str]:
        """Get fields that can be searched"""
        return [
            field_name
            for field_name, field_info in self.schema.items()
            if field_info.get("searchable", False)
        ]


# Singleton instance
_schema_loader = SchemaLoader()


def get_schema_loader() -> SchemaLoader:
    """Get schema loader instance"""
    return _schema_loader
