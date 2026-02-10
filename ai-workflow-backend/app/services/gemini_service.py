import os
from typing import Dict, Any, Optional, List
import google.generativeai as genai
from dotenv import load_dotenv
from app.config import settings
import logging

# Load environment variables explicitly
load_dotenv()

logger = logging.getLogger(__name__)


class GeminiService:
    """Service for interacting with Google Gemini AI with multi-key rotation."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Gemini service."""
        # Use provided key, or fall back to settings
        if api_key:
            self.api_keys = [api_key]
        else:
            # Get all keys from settings
            self.api_keys = settings.gemini_api_keys
            
        if not self.api_keys:
            logger.warning("⚠️ No Gemini API keys configured!")
            
        logger.info(f"🔑 Loaded {len(self.api_keys)} Gemini API key(s)")
    
    def _detect_best_model(self, api_key: str) -> Optional[str]:
        """
        Detect best available model for a given API key.
        
        Priority: gemini-2.5-flash-002 > gemini-2.5-flash > gemini-1.5-flash > others
        """
        try:
            genai.configure(api_key=api_key)
            logger.info(f"� Detecting models for key (ends with {api_key[-6:]})")
            
            available_models = genai.list_models()
            suitable_models = [
                model.name for model in available_models
                if 'generateContent' in model.supported_generation_methods
            ]
            
            if not suitable_models:
                return None
            
            # Extract short names
            short_names = [m.split('/')[-1] for m in suitable_models]
            logger.info(f"📋 Available: {', '.join(short_names[:5])}...")  # Show first 5
            
            # Priority order
            priority = [
                'gemini-2.0-flash',
                'gemini-2.0-flash-exp',
                'gemini-1.5-flash',
                'gemini-1.5-pro'
            ]

            
            for priority_model in priority:
                for model_name in suitable_models:
                    if priority_model in model_name:
                        short = model_name.split('/')[-1]
                        logger.info(f"✅ Selected: {short}")
                        return model_name
            
            # Fallback
            return suitable_models[0]
            
        except Exception as e:
            logger.error(f"❌ Model detection failed: {e}")
            return None
    
    def generate_text(
        self,
        prompt: str,
        model: str = "gemini-2.5-flash",
        temperature: float = 0.7,
        max_tokens: int = 2048,
        use_search: bool = False,
        file_path: Optional[str] = None,
        response_mime_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate text using Gemini with multi-key rotation.
        
        Tries each API key in sequence until one succeeds.
        """
        # Tools configuration
        tools = [{"google_search_retrieval": {}}] if use_search else None
        
        # Handle file upload if provided
        gemini_file = None
        if file_path and os.path.exists(file_path):
            try:
                logger.info(f"📤 Uploading file: {file_path}")
                # Use first key for upload
                if self.api_keys:
                    genai.configure(api_key=self.api_keys[0])
                gemini_file = genai.upload_file(path=file_path)
                logger.info(f"✅ File uploaded")
            except Exception as e:
                logger.warning(f"⚠️ File upload failed: {e}")
        
        # Try each API key
        if not self.api_keys:
            raise Exception("No Gemini API keys configured. Add keys to .env file.")
        
        logger.info(f"\n{'='*60}")
        logger.info(f"🚀 Attempting Gemini generation with {len(self.api_keys)} key(s)")
        logger.info(f"{'='*60}")
        
        for idx, api_key in enumerate(self.api_keys, 1):
            logger.info(f"\n🔑 Trying Key #{idx}/{len(self.api_keys)} (ends with {api_key[-6:]})")
            
            try:
                # Configure with this key
                genai.configure(api_key=api_key)
                
                # Auto-detect best model for this key
                detected_model = self._detect_best_model(api_key)
                if not detected_model:
                    logger.warning(f"⚠️ No models available for key #{idx}")
                    continue
                
                model_short = detected_model.split('/')[-1]
                logger.info(f"🚀 Generating with: {model_short}")
                
                # Create model instance
                model_instance = genai.GenerativeModel(detected_model, tools=tools)
                
                # Prepare content
                content = [prompt]
                if gemini_file:
                    content.append(gemini_file)
                
                # Prepare generation config
                gen_config = {
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                }
                
                if response_mime_type:
                    gen_config["response_mime_type"] = response_mime_type
                
                # Safety settings to minimize blocking
                safety_settings = [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                ]
                
                # Generate
                response = model_instance.generate_content(
                    content,
                    generation_config=genai.types.GenerationConfig(**gen_config),
                    safety_settings=safety_settings
                )
                
                # Check for candidates safely
                if not hasattr(response, 'candidates') or not response.candidates:
                    logger.warning(f"⚠️ No candidates in response for Key #{idx}")
                    continue
                
                primary_candidate = response.candidates[0]
                finish_reason = getattr(primary_candidate, 'finish_reason', None)
                logger.info(f"📊 Finish reason: {finish_reason}")
                
                # Handle safety blocks or empty outputs
                generated_text = ""
                try:
                    # Try direct text access
                    generated_text = response.text
                except (ValueError, Exception) as e:
                    # This happens if response is blocked or has no text parts
                    logger.warning(f"⚠️ Response.text access failed. Attempting part recovery...")
                    try:
                        if hasattr(primary_candidate, 'content') and hasattr(primary_candidate.content, 'parts'):
                            parts = [part.text for part in primary_candidate.content.parts if hasattr(part, 'text')]
                            generated_text = "".join(parts)
                    except:
                        pass
                
                if not generated_text:
                    logger.warning(f"⚠️ Model returned zero text. Finish reason: {finish_reason}")
                    continue

                logger.info(f"\n{'✅'*20}")
                logger.info(f"✅ SUCCESS with Key #{idx}!")
                logger.info(f"✅ Model: {model_short} ({len(generated_text)} chars)")
                logger.info(f"{'✅'*20}\n")
                
                return {
                    "text": generated_text,
                    "model": model_short,
                    "finish_reason": str(finish_reason),
                    "tokens": {"prompt": 0, "completion": 0, "total": 0}
                }


                
            except Exception as e:
                error_msg = str(e)
                logger.warning(f"❌ Key #{idx} failed: {error_msg[:100]}")
                
                # Wait on quota errors
                if "429" in error_msg or "quota" in error_msg.lower():
                    import time
                    logger.info("⏳ Quota hit, waiting 1s...")
                    time.sleep(1)
                
                # Continue to next key
                continue
        
        # All keys failed
        logger.error("\n" + "="*60)
        logger.error("❌ All API keys exhausted!")
        logger.error("="*60)
        raise Exception("All Gemini API keys failed. Check .env file or wait for quota reset.")

