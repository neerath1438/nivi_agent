"""API endpoints for viewing node runner code."""
from fastapi import APIRouter, HTTPException
import os
from pathlib import Path

router = APIRouter(prefix="/api/code", tags=["code"])

# Mapping of node types to their runner file paths
NODE_RUNNER_MAP = {
    "chatInput": "app/runners/chat_input_runner.py",
    "promptTemplate": "app/runners/prompt_runner.py",
    "llm": "app/runners/llm_runner.py",
    "elasticsearch": "app/runners/elasticsearch_runner.py",
    "chatOutput": "app/runners/output_runner.py",
    "openai": "app/runners/openai_runner.py",
    "gemini": "app/runners/gemini_runner.py",
    "claude": "app/runners/claude_runner.py",
    "pythonRunner": "app/runners/python_runner.py",
    'uiComponents': 'app/runners/ui_components_runner.py',
    "ide": "app/runners/ide_runner.py"
}


@router.get("/{node_type}")
async def get_node_code(node_type: str):
    """
    Get the backend runner code for a specific node type.
    
    Args:
        node_type: Type of node (chatInput, llm, elasticsearch, etc.)
        
    Returns:
        Dictionary containing node_type, code, and file_path
    """
    if node_type not in NODE_RUNNER_MAP:
        raise HTTPException(
            status_code=404,
            detail=f"Node type '{node_type}' not found. Available types: {', '.join(NODE_RUNNER_MAP.keys())}"
        )
    
    file_path = NODE_RUNNER_MAP[node_type]
    
    # Get the project root directory (ai-workflow-backend)
    current_file = Path(__file__)
    backend_root = current_file.parent.parent.parent
    full_path = backend_root / file_path.replace("/", os.sep)
    
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            code = f.read()
        
        return {
            "node_type": node_type,
            "code": code,
            "file_path": file_path,
            "line_count": len(code.split("\n"))
        }
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Code file not found: {file_path}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading code file: {str(e)}"
        )


@router.get("/")
async def list_available_nodes():
    """List all available node types that have code."""
    return {
        "available_nodes": list(NODE_RUNNER_MAP.keys()),
        "count": len(NODE_RUNNER_MAP)
    }
