"""LLM node runner - supports multiple providers."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner
from app.services.llm_service import LLMService
from app.services.gemini_service import GeminiService
from app.services.claude_service import ClaudeService


class LLMRunner(BaseRunner):
    """Runner for LLM node - works with any AI provider."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute LLM with provider configuration from previous node.
        
        Detects provider from state and uses appropriate service.
        """
        # Get LLM parameters from state
        provider = state.get("provider", "openai")
        model = state.get("model", "gpt-4o-mini")
        temperature = float(state.get("temperature", 0.7))
        max_tokens_config = state.get("maxTokens", 1000)
        api_key = state.get("apiKey") if state.get("apiKey") else None
        
        # Validate and fix maxTokens if too low
        # Many UI configs accidentally set this to 1, which causes truncated responses
        if max_tokens_config < 100:
            # print(f"⚠️  maxTokens was {max_tokens_config} (too low!), using 1000 instead")
            max_tokens = 1000
        else:
            max_tokens = int(max_tokens_config)
        
        # Get prompt from state (from prompt template node OR elasticsearch results)
        prompt = state.get("prompt", state.get("search_results", state.get("input", "")))
        
        # Check for Knowledge Base context (RAG)
        if state.get("knowledge_context"):
            from app.services.prompts import KNOWLEDGE_BASE_PROMPT
            
            user_query = state.get("input", "")
            context = state.get("knowledge_context", "")
            
            # print(f"📚 Detected Knowledge Base context - using RAG grounding")
            prompt = KNOWLEDGE_BASE_PROMPT.format(
                user_message=user_query,
                context=context
            )
        
        # Smart prompt detection: If we have ES results, use NL generator prompt
        elif state.get("search_results") or state.get("total") is not None:
            # We have ES results - generate natural language response
            from app.services.prompts import NL_GENERATOR_PROMPT
            
            user_query = state.get("input", "")
            es_results = state.get("search_results", state.get("output", ""))
            
            # print(f"🔄 Detected ES results - using Natural Language Generator")
            prompt = NL_GENERATOR_PROMPT.format(
                user_message=user_query,
                data=es_results
            )
        
        # Inject Programming Language instructions if set
        instructions = []
        if state.get("frontend_lang"):
            instructions.append(f"- Frontend Stack: **{state.get('frontend_lang')}**")
        if state.get("backend_lang"):
            instructions.append(f"- Backend Stack: **{state.get('backend_lang')}**")
        
        # Inject Theme Tokens if set
        if state.get("theme_tokens"):
            tokens = state.get("theme_tokens")
            instructions.append(f"- Visual Theme: **{state.get('selected_theme')}**")
            instructions.append(f"- Design System: Use Background {tokens['bg_color']}, Primary Color {tokens['primary_color']}, Card Styles: {tokens['card_style']}, Shadows: {tokens['shadows']}. Fonts: {tokens['font_family']}")
            
        if instructions:
            lang_str = "\n".join(instructions)
            prompt = f"{prompt}\n\nCRITICAL: The code output or technical explanation MUST adhere strictly to the following technology stacks:\n{lang_str}\nDo not use any other frameworks or languages."
        
        if not prompt:
            return {
                "llm_response": "No prompt provided",
                "output": "No prompt provided"
            }
        
        # print(f"🤖 LLM Execution Details:")
        # print(f"   - Provider: {provider}")
        # print(f"   - Model: {model}")
        # print(f"   - Temperature: {temperature}")
        # print(f"   - Max Tokens: {max_tokens}")
        # print(f"   - Prompt Length: {len(str(prompt))} chars")
        
        # Select and use appropriate service
        try:
            if provider == "gemini":
                service = GeminiService(api_key=api_key)
                response = service.generate_text(
                    prompt=str(prompt),
                    model=model,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    file_path=state.get("file_path") # Pass the file for Multimodal analysis
                )
            elif provider == "claude":
                service = ClaudeService(api_key=api_key)
                response = service.generate_text(
                    prompt=str(prompt),
                    model=model,
                    temperature=temperature,
                    max_tokens=max_tokens
                )
            else:  # Default to OpenAI
                service = LLMService(api_key=api_key)
                
                
                # Smart System Message - Mirror Mode Force
                system_message = state.get("system_prompt", "You are a professional and helpful assistant.")
                
                # Check for RAG/Persona context in the prompt itself
                if "Assistant Role:" in str(prompt) or "Instructions:" in str(prompt) or "Greetings from" in str(prompt):
                    # If instructions are in the prompt, we move them to system message for better steerability
                    parts = str(prompt).split("\n\n", 1)
                    if len(parts) > 1 and ("Role:" in parts[0] or "Instructions:" in parts[0]):
                        system_message = parts[0] + "\n\nCRITICAL INSTRUCTION: You MUST START your response by REPEATING the 'Structure to use' EXACTLY as shown in the prompt. Do not rephrase the greetings or list. Just copy-paste the start, then answer."
                        prompt = parts[1]
                    else:
                        # Fallback for when parts aren't cleanly split but signature exists
                        system_message += "\n\nCRITICAL: If the user provided a specific Greeting/Structure, you MUST use it EXACTLY as written at the start of your reply. Do not change a single word of the greeting."

                response = service.chat_completion(
                    messages=[
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": str(prompt)}
                    ],
                    model=model,
                    temperature=temperature,
                    max_tokens=max_tokens
                )
            
            response_text = response["text"]
            
            # Print the prompt that was JUST sent to OpenAI
            print(f"🤖 [LLM] SENT PROMPT TO AI: {len(str(prompt))} chars")
            print(f"--- SENT START ---\n{prompt[:300]}...\n--- SENT END ---")
            
            print(f"\n{'='*40}")
            print(f"{response_text}")
            print(f"{'='*40}\n")
            
            return {
                "llm_response": response_text,
                "output": response_text,
                "provider": provider,
                "model": model,
                "tokens": response.get("tokens", {})
            }
        except Exception as e:
            # print(f"\n{'!'*80}")
            # print(f"❌ LLM RUNNER ERROR: {str(e)}")
            # print(f"{'!'*80}\n")
            raise e
