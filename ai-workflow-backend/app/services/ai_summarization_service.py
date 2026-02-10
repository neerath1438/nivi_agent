"""AI Summarization Service with Multi-Provider Fallback.

This service implements intelligent summarization with:
- Phase A: Gemini multi-key rotation
- Phase B: OpenAI fallback
- Phase C: Graceful error handling
"""

import logging
from typing import Dict, Any, Optional, List
import google.generativeai as genai
from openai import OpenAI

from app.config import settings

logger = logging.getLogger(__name__)


class AISummarizationService:
    """Service for AI-powered text summarization with provider fallback."""
    
    # Summarization prompts by style
    STYLE_PROMPTS = {
        "concise": "Provide a concise summary of the following text in 2-3 sentences:",
        "detailed": "Provide a comprehensive and detailed summary of the following text, covering all key points:",
        "bullet-points": "Summarize the following text as a bulleted list of key points:"
    }
    
    @staticmethod
    def summarize_text(
        text: str,
        style: str = "concise",
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Summarize text using available AI providers.
        
        Args:
            text: Text to summarize
            style: Summary style (concise/detailed/bullet-points)
            max_tokens: Optional maximum tokens for summary
            
        Returns:
            Dictionary with summary, model_used, and provider
        """
        # Determine default instructions based on style
        if style == "bullet-points":
            default_instr = "in clear, concise bullet points"
        elif style == "detailed":
            default_instr = "in a detailed, comprehensive paragraph"
        else:
            default_instr = "in a concise, easy-to-read paragraph"

        # Build a flexible, multi-lingual prompt
        full_prompt = (
            f"You are a versatile AI summarization assistant. Follow these rules strictly:\n"
            f"1. **LANGUAGE PRIORITY**: Always respond in **ENGLISH** by default.\n"
            f"   - Even if the input text or user question is in Tamil, Tanglish, or any other language, your summary MUST be in English.\n"
            f"   - ONLY provide a non-English summary if the user explicitly requests it (e.g., 'summarize in Tamil' or 'answer in Tamil').\n"
            f"2. **INSTRUCTION PRIORITY**: Look for instructions like 'in bullets', 'in 3 lines', 'summarize as a story', etc.\n"
            f"3. **OVERRIDE**: User instructions in the text always overwrite node settings.\n"
            f"4. **FALLBACK**: If no instructions are found, summarize {default_instr} in English.\n"
            f"5. {'Limit to approx ' + str(max_tokens) + ' tokens if possible.' if max_tokens else ''}\n\n"
            f"INPUT TEXT (CONTENT + INSTRUCTIONS):\n{text}\n\n"
            f"SUMMARY:"
        )
        
        # Phase A: Try Gemini with multiple keys
        gemini_keys = settings.gemini_api_keys
        if gemini_keys:
            logger.info(f"🔑 Found {len(gemini_keys)} Gemini API key(s) to try")
            for idx, key in enumerate(gemini_keys, 1):
                logger.info(f"\n{'='*60}")
                logger.info(f"🔑 Attempting Gemini Key #{idx}/{len(gemini_keys)} (ends with {key[-6:]})")
                logger.info(f"{'='*60}")
                
                result = AISummarizationService._try_gemini_with_key(key, full_prompt, max_tokens)
                
                if result:
                    logger.info(f"\n{'✅'*20}")
                    logger.info(f"✅ SUCCESS with Key #{idx}!")
                    logger.info(f"✅ Model: {result['model_used']}")
                    logger.info(f"{'✅'*20}\n")
                    return result
                else:
                    logger.warning(f"❌ Key #{idx} failed, trying next key...")
        else:
            logger.warning("⚠️ No Gemini API keys configured in .env")
        
        # Phase B: Fallback to OpenAI
        logger.info("\n" + "="*60)
        logger.info("🔄 All Gemini keys failed, falling back to OpenAI GPT-4o-mini")
        logger.info("="*60)
        openai_result = AISummarizationService._try_openai_fallback(full_prompt, max_tokens)
        if openai_result:
            logger.info("✅ OpenAI fallback succeeded")
            return openai_result
        
        # Phase C: All providers failed
        logger.error("❌ All AI providers failed")
        return {
            "summary": "All AI providers currently unavailable. Please check API quotas and keys.",
            "model_used": "none",
            "provider": "error",
            "error": True
        }
    
    @staticmethod
    def _try_gemini_with_key(
        api_key: str,
        prompt: str,
        max_tokens: Optional[int]
    ) -> Optional[Dict[str, Any]]:
        """
        Try to summarize using a specific Gemini API key.
        
        For each key, detects which models are available and uses the best one.
        
        Returns:
            Result dict if successful, None if failed
        """
        try:
            # Configure Gemini with this specific key
            genai.configure(api_key=api_key)
            
            # Auto-detect best available model FOR THIS SPECIFIC KEY
            logger.info(f"🔍 Detecting best model for this key...")
            model_name = AISummarizationService._detect_best_gemini_model(api_key)
            
            if not model_name:
                logger.warning("⚠️ No suitable Gemini model found for this key")
                return None
            
            # Extract short name for logging
            model_short_name = model_name.split('/')[-1] if '/' in model_name else model_name
            logger.info(f"🚀 Attempting generation with: {model_short_name}")
            
            # Create model instance
            model = genai.GenerativeModel(model_name)
            
            # Generate summary
            generation_config = {}
            if max_tokens:
                generation_config['max_output_tokens'] = max_tokens
            
            logger.info(f"⏳ Generating summary...")
            response = model.generate_content(
                prompt,
                generation_config=generation_config if generation_config else None
            )
            
            # Extract text from response safely
            summary_text = ""
            try:
                summary_text = response.text
            except (ValueError, Exception):
                # Fallback to parts recovery if blocked
                try:
                    if hasattr(response, 'candidates') and response.candidates:
                        parts = [part.text for part in response.candidates[0].content.parts if hasattr(part, 'text')]
                        summary_text = "".join(parts)
                except:
                    summary_text = str(response)
            
            if not summary_text:
                return None
            
            return {
                "summary": summary_text,
                "model_used": model_name,
                "provider": "gemini",
                "error": False
            }
            
        except Exception as e:
            logger.error(f"Gemini error: {str(e)}")
            return None
    
    @staticmethod
    def _detect_best_gemini_model(api_key: str) -> Optional[str]:
        """
        Auto-detect the best available Gemini model for this specific key.
        
        Priority: gemini-2.5-flash → gemini-1.5-flash → gemini-1.5-pro → gemini-2.0-flash → first available
        
        Returns:
            Model name if found, None otherwise
        """
        try:
            # Configure with the key
            genai.configure(api_key=api_key)
            
            logger.info(f"🔍 Detecting available models for API key (ends with {api_key[-6:]})")
            
            # List available models
            available_models = genai.list_models()
            
            # Filter models that support generateContent
            suitable_models = [
                model.name for model in available_models
                if 'generateContent' in model.supported_generation_methods
            ]
            
            if not suitable_models:
                logger.warning("⚠️ No suitable models found for this key")
                return None
            
            logger.info(f"📋 Available models for this key: {', '.join([m.split('/')[-1] for m in suitable_models])}")
            
            # Priority selection - gemini-2.5-flash is FIRST priority
            priority_order = [
                'gemini-2.5-flash',
                'gemini-1.5-flash', 
                'gemini-1.5-pro',
                'gemini-2.0-flash-exp',
                'gemini-2.0-flash',
                'gemini-pro'
            ]
            
            # Try each priority model
            for priority_model in priority_order:
                for model_name in suitable_models:
                    # Extract just the model name (e.g., "models/gemini-2.5-flash" -> "gemini-2.5-flash")
                    model_short_name = model_name.split('/')[-1] if '/' in model_name else model_name
                    
                    if priority_model in model_short_name:
                        logger.info(f"✅ Selected model: {model_short_name} (priority match)")
                        return model_name
            
            # Return first available if no priority match
            if suitable_models:
                fallback_model = suitable_models[0]
                fallback_short = fallback_model.split('/')[-1] if '/' in fallback_model else fallback_model
                logger.info(f"⚠️ Using fallback model: {fallback_short}")
                return fallback_model
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Model detection error: {str(e)}")
            return None
    
    @staticmethod
    def _try_openai_fallback(
        prompt: str,
        max_tokens: Optional[int]
    ) -> Optional[Dict[str, Any]]:
        """
        Fallback to OpenAI GPT-4o-mini.
        
        Returns:
            Result dict if successful, None if failed
        """
        try:
            client = OpenAI(api_key=settings.openai_api_key)
            
            # Prepare request parameters
            request_params = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
            
            if max_tokens:
                request_params["max_tokens"] = max_tokens
            
            # Call OpenAI API
            response = client.chat.completions.create(**request_params)
            
            summary_text = response.choices[0].message.content
            
            return {
                "summary": summary_text,
                "model_used": "gpt-4o-mini",
                "provider": "openai",
                "error": False
            }
            
        except Exception as e:
            logger.error(f"OpenAI error: {str(e)}")
            return None
    
    @staticmethod
    def _chunk_large_text(text: str, max_tokens: int = 30000) -> List[str]:
        """
        Split large text into manageable chunks.
        
        Simple character-based chunking. For production, use token-based chunking.
        
        Args:
            text: Text to chunk
            max_tokens: Approximate max tokens per chunk (rough: 1 token ≈ 4 chars)
            
        Returns:
            List of text chunks
        """
        # Rough approximation: 1 token ≈ 4 characters
        max_chars = max_tokens * 4
        
        if len(text) <= max_chars:
            return [text]
        
        # Simple chunking by paragraphs
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = ""
        
        for para in paragraphs:
            if len(current_chunk) + len(para) <= max_chars:
                current_chunk += para + "\n\n"
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = para + "\n\n"
        
        # Add remaining chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks if chunks else [text]
