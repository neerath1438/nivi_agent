from typing import Dict, Any
from app.runners.base_runner import BaseRunner

class ConditionRunner(BaseRunner):
    """Runner for branching logic (If/Else)."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        condition_type = node_data.get("condition_type", "contains")
        target_value = node_data.get("value", "")
        
        # Priority check: If 'found' exists in state and user hasn't specified a field, 
        # use it for a more reliable check from MongoDB/Search nodes.
        field_to_check = node_data.get("field", "output")
        raw_value = state.get(field_to_check)
        
        # Fallback for empty output
        if field_to_check == "output" and (raw_value is None or str(raw_value).strip() == ""):
            if "found" in state:
                raw_value = state["found"]
            else:
                raw_value = state.get("context", state.get("mongodb_context", ""))
                print(f"🔄 Output empty, falling back to context/mongodb_context check")

        current_value = str(raw_value) if raw_value is not None else ""
        
        print(f"⚖️ Checking Condition: '{current_value[:50]}...' {condition_type} '{target_value}' (Raw type: {type(raw_value)})")
        
        result = False
        # If raw_value is boolean, handle simple truthiness if target is blank
        if isinstance(raw_value, bool) and not target_value.strip():
            result = raw_value
        else:
            c_val = current_value.lower().strip()
            t_val = str(target_value).lower().strip()
            
            if condition_type == "contains":
                result = t_val in c_val if t_val else bool(c_val)
            elif condition_type == "not_contains":
                result = t_val not in c_val
            elif condition_type == "equals":
                result = c_val == t_val
            elif condition_type == "not_equals":
                result = c_val != t_val
            elif condition_type == "not_empty":
                result = bool(c_val)
            elif condition_type == "is_new":
                # Check if 'found' is False, or if output says 'No matching'
                if isinstance(raw_value, bool):
                    result = not raw_value
                else:
                    result = "no matching" in c_val
            elif condition_type == "is_existing":
                # Check if 'found' is True, or if output says 'Found Record'
                if isinstance(raw_value, bool):
                    result = raw_value
                else:
                    result = "found record" in c_val
            
        print(f"🛤️  Condition Result: {result}")
            
        return {
            "condition_result": result,
            "output": current_value,
            "path": "true" if result else "false"
        }
