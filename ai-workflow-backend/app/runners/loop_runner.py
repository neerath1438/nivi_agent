"""Loop runner for iterative workflow control."""
import logging
from typing import Dict, Any
from app.runners.base_runner import BaseRunner

logger = logging.getLogger(__name__)

class LoopRunner(BaseRunner):
    """
    Iterative control runner.
    Manages loop state and triggers paths.
    """
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        loop_id = node_data.get("node_id", "default_loop")
        iterations_raw = node_data.get("iterations", 1)
        
        try:
            iterations = int(iterations_raw)
        except:
            iterations = 1
            
        loop_state_key = f"loop_state_{loop_id}"
        current_idx = state.get(loop_state_key, 0)
        
        if current_idx < iterations:
            # Increment index for the next run
            state[loop_state_key] = current_idx + 1
            
            # The "each" path should trigger the loop body
            return {
                "path": "each",
                "current_index": current_idx,
                "output": f"Loop {loop_id}: Iteration {current_idx + 1} of {iterations}",
                "status": "success",
                # Special instruction for FlowExecutor to allow re-running nodes
                # If the UI provides the list of nodes in the loop body, we can reset them.
                "reset_nodes": node_data.get("loop_body_nodes", []) 
            }
        else:
            # Loop finished
            # Reset the index so the flow can be run again later
            state[loop_state_key] = 0
            return {
                "path": "done",
                "output": f"Loop {loop_id}: Completed {iterations} iterations",
                "status": "success"
            }
