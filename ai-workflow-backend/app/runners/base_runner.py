"""Base runner class for all node types."""
from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseRunner(ABC):
    """Abstract base class for node runners."""
    
    @abstractmethod
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the node logic.
        
        Args:
            node_data: Node configuration and parameters
            state: Shared execution state
        
        Returns:
            Dict with updated state values
        """
        pass
