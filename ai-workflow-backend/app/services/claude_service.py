"""Claude AI service."""
import os
from typing import Dict, Any, Optional
from anthropic import Anthropic


class ClaudeService:
    """Service for interacting with Anthropic Claude AI."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Claude service."""
        self.api_key = api_key or os.getenv("CLAUDE_API_KEY")
        self.client = Anthropic(api_key=self.api_key) if self.api_key else None
    
    def generate_text(
        self,
        prompt: str,
        model: str = "claude-3-5-sonnet-20241022",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> Dict[str, Any]:
        """
        Generate text using Claude model.
        
        Args:
            prompt: The input prompt
            model: The model to use
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            Dict containing response text and metadata
        """
        if not self.client:
            raise Exception("Claude API key not configured")
        
        try:
            # Create message
            message = self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return {
                "text": message.content[0].text,
                "model": model,
                "finish_reason": message.stop_reason,
                "tokens": {
                    "prompt": message.usage.input_tokens,
                    "completion": message.usage.output_tokens,
                    "total": message.usage.input_tokens + message.usage.output_tokens
                }
            }
        except Exception as e:
            raise Exception(f"Claude API error: {str(e)}")
