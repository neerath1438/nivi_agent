"""OpenAI LLM service for chat completions."""
import logging
from typing import Dict, Any, Optional, List
from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """Service for interacting with OpenAI API."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize OpenAI client.
        
        Args:
            api_key: Optional API key override. If not provided, uses settings.
        """
        key_to_use = api_key if api_key else settings.openai_api_key
        self.client = OpenAI(api_key=key_to_use)
        self.default_model = settings.openai_model
    
    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Generate a chat completion using OpenAI.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model to use (defaults to config model)
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens to generate
        
        Returns:
            Dict containing response text and metadata
        """
        try:
            model = model or self.default_model
            
            logger.info(f"Calling OpenAI with model: {model}")
            
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            result = {
                "text": response.choices[0].message.content,
                "model": model,
                "tokens": {
                    "prompt": response.usage.prompt_tokens,
                    "completion": response.usage.completion_tokens,
                    "total": response.usage.total_tokens
                },
                "finish_reason": response.choices[0].finish_reason
            }
            
            logger.info(f"OpenAI response received. Tokens: {result['tokens']['total']}")
            
            return result
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"LLM service error: {str(e)}")


# Global service instance
llm_service = LLMService()
