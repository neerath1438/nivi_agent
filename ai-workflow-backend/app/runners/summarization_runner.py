"""Summarization Node Runner."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner
from app.services.ai_summarization_service import AISummarizationService


class SummarizationRunner(BaseRunner):
    """Runner for AI text summarization with multi-provider fallback."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Summarize text using intelligent multi-provider fallback.
        
        Text can come from:
        1. Previous node output (e.g., Knowledge Base)
        2. Direct input in Chat Input
        3. Node configuration
        
        Args:
            node_data: Node configuration
            state: Current workflow state
            
        Returns:
            Dictionary with summary and metadata
        """
        # 1. Get core content to summarize (from Knowledge Base or previous node)
        main_content = ""
        if "output" in state and state["output"]:
            main_content = str(state["output"])
        elif "knowledge_context" in state and state["knowledge_context"]:
            main_content = str(state["knowledge_context"])
        
        # 2. Get user instructions (from Chat Input)
        user_instructions = ""
        if "input" in state and state["input"]:
            user_instructions = str(state["input"])
            
        # Combine them: Instruction + Content
        if user_instructions and main_content:
            text = f"INSTRUCTION: {user_instructions}\n\nCONTENT TO SUMMARIZE:\n{main_content}"
        elif main_content:
            text = main_content
        elif user_instructions:
            text = user_instructions
        else:
            text = node_data.get("text", "")

        if not text or not text.strip():
            return {
                "error": "No content found. Please provide text or connect a Knowledge Base node.",
                "output": "⚠️ No content to summarize found.",
                "summary": ""
            }
        
        # Get configuration
        style = node_data.get("style", "concise")
        max_length = node_data.get("maxLength")
        
        # Convert max_length to max_tokens if provided
        max_tokens = None
        if max_length and isinstance(max_length, (int, float)) and max_length > 0:
            # Rough approximation: words to tokens (1 word ≈ 1.3 tokens)
            max_tokens = int(max_length * 1.3)
        
        print(f"🤖 Summarizing text ({len(text)} chars) with style: {style}")
        
        # Call AI Summarization Service
        result = AISummarizationService.summarize_text(
            text=text,
            style=style,
            max_tokens=max_tokens
        )
        
        # Prepare output
        if result.get("error"):
            print(f"❌ Summarization failed: {result.get('summary')}")
            return {
                "error": result.get("summary"),
                "output": f"❌ Summarization Error: {result.get('summary')}",
                "summary": ""
            }
        
        summary_text = result["summary"]
        model_used = result["model_used"]
        provider = result["provider"]
        
        print(f"✅ Summary generated using {provider} ({model_used})")
        
        return {
            "summary": summary_text,
            "output": summary_text,  # Pass to next node
            "model_used": model_used,
            "provider": provider,
            "original_length": len(text),
            "summary_length": len(summary_text),
            "metadata": {
                "style": style,
                "model": model_used,
                "provider": provider
            }
        }
