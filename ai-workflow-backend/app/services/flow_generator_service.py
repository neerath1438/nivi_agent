import json
import asyncio
from typing import Dict, Any, List
from app.services.gemini_service import GeminiService

AI_ARCHITECT_PROMPT = """You are an AI Workflow Architect. Your task is to convert natural language descriptions of workflows into a structured JSON format that represents React Flow nodes and edges.

**Available Node Types:**
- `chatInput`: Web Chat Input node.
- `whatsAppInput`: WhatsApp Trigger node (Use this as the first node for all WhatsApp/Mobile bots).
- `promptTemplate`: Formats input with a template. Must set `data.template`.
- `gemini`: Google Gemini Config. Set `data.model` to "gemini-2.5-flash".
- `openai`: OpenAI Config. Set `data.model` to "gpt-4o-mini".
- `llm`: LLM Execute node. MUST have edges from both a Config node AND a Prompt node (OR a Search node).
- `elasticsearch`: Local search.
- `search`: Google Search.
- `knowledge`: Knowledge Base. Extracts data from uploaded files (Resume, Excel, etc).
- `http`: API Connector.
- `condition`: Branching logic. Must set `data.condition` (e.g., "contains") and `data.value` (e.g., "No matching data").
- `pdf`: PDF Generator.
- `summarization`: Smart multi-provider summarization node.
- `documentGenerator`: Multi-format document export (PDF/DOCX/TXT/MD).
- `mongoDB`: MongoDB Data Source. Supports both reading and writing. Set `data.operation` to "FIND" or "INSERT".
    - For "FIND": Set `data.query` (JSON object, e.g., `{"phone_number": "{phone_number}"}`).
    - For "INSERT": Set `data.document` (JSON object, e.g., `{"phone_number": "{phone_number}", "status": "responded"}`).
    - Connects to `promptTemplate` (for FIND) or follows `whatsAppOutput` (for saving logs).
- `tshirtCatalog`: T-Shirt Catalog Bot. One-time link delivery per customer. Set `data.company_name` and `data.catalog_link`. Connects between `whatsAppInput` and `whatsAppOutput`.
- `whatsAppInput`: Triggers flow on incoming WhatsApp message. Connects to `promptTemplate` or `summarization` or `mongoDB` or `tshirtCatalog`.
- `whatsAppOutput`: Sends a message back to WhatsApp. Receives input from `llm` or `summarization` or `tshirtCatalog`.
- `chatOutput`: Displays final result.
- `pythonRunner`: Python Code Execution node. Generates and runs Python code based on a prompt. Use this for mathematical calculations, data processing, or logical loops.
- `reactRunner`: React & Frontend Execution node. Starts the development server for the generated project. Receives URL and code.
- `screenshot`: Capture UI node. Takes a high-quality screenshot of the website preview. Connects after `browser` or `reactRunner`.
- `uiComponents`: UI Designer node. Generates technical specifications and component architecture for the UI. Connects between `masterPrompt` and `reactRunner`.
- `promptGenerator`: Prompt Expansion node. Expands a simple user request into detailed technical specifications. Use this before the UI Components node for complex UIs.
- `masterPrompt`: Master JSON node. Converts expanded descriptions into a structured MASTER JSON format required for high-quality generation.
- `language`: Generic language node (Deprecated).
- `frontendLanguage`: Frontend Stack selector. Supports React + Tailwind, Next.js, etc. Connects to `uiComponents`.
- `backendLanguage`: Backend Stack selector. Supports Python, Node, etc. Connects to `llm` or `pythonRunner`.
- `theme`: Visual Theme selector. Provides premium design systems (Glassmorphism, Cyberpunk, Minimalist, Retro). Connects to `promptGenerator` or `uiComponents`.
- `zip`: Zip Utility. Compresses multiple files or an entire project structure into a downloadable `.zip` file. (Deprecated: Use `ide` instead for coding projects).
- `ide`: AI-Powered Coding Environment. Provides an integrated code editor and file explorer directly in the chat. Use this for "Project", "Code", "Develop", "API", or "UI" requests.
- `browser`: Browser Automation node. Use this for web scraping, automated testing, or site navigation. Supports `headless` (silent) and `headed` (visible) modes.
- `loop`: For-Loop (Iterator) node. Use this to run a branch of the workflow multiple times (e.g., scraping 10 URLs). It has two outputs: `each` (runs for every iteration) and `done` (runs once after all iterations).

**Strict Connection Rules:**
1. `chatInput` -> `promptTemplate` OR `search` OR `knowledge` OR `http`.
2. `knowledge` -> `llm` (Extracted data goes to AI).
3. `promptTemplate` -> `llm`.
3. `search` -> `llm` (Search results go to LLM).
4. `http` -> `llm` (API data goes to LLM for processing).
5. `llm` -> `condition` (Branch based on LLM output).
6. `llm` -> `pdf` (Turn LLM text into a PDF).
7. `condition` True Path -> Connect edge with `sourceHandle: "true"`.
8. `condition` False Path -> Connect edge with `sourceHandle: "false"`.
9. `chatInput` / `knowledge` -> `summarization` (Summarize input or files).
10. `summarization` -> `documentGenerator` (Export summary to doc).
11. `llm` / `pdf` / `summarization` / `documentGenerator` / `pythonRunner` -> `chatOutput` (Default path).
    - Note: `pythonRunner` provides both `{output}` (execution result) and `{generated_code}` (raw code).
12. `llm` -> `email` (If user wants to send/draft an email).
13. `whatsAppInput` -> `promptTemplate` OR `summarization` OR `tshirtCatalog`.
14. `llm` / `summarization` / `tshirtCatalog` -> `whatsAppOutput`.
15. `whatsAppOutput` -> `mongoDB` (INSERT) [To save message history or customer status].
16. `chatInput` -> `pythonRunner`.
17. `chatInput` -> `uiComponents` -> `reactRunner` -> `ide` -> `chatOutput`.
18. **High Quality UI Flow:** `chatInput` -> `theme` -> `promptGenerator` -> `masterPrompt` -> `frontendLanguage` -> `uiComponents` -> `reactRunner` -> `browser` (if visibility needed) -> `screenshot` -> `ide` -> `chatOutput`.
19. **Full Stack Flow:** `chatInput` -> `theme` -> `frontendLanguage` -> `backendLanguage` -> `masterPrompt` -> `uiComponents` -> `reactRunner` -> `ide` -> `chatOutput`.
20. **Backend Project Flow:** `chatInput` -> `promptGenerator` -> `masterPrompt` -> `backendLanguage` -> `pythonRunner` -> `ide` -> `chatOutput`. (Skip `theme` for backend-only projects).
21. **IDE RULE (CRITICAL):** For ANY project generation (Frontend, Backend, or Fullstack), YOU MUST ALWAYS end the generation chain with an `ide` node before connecting to `chatOutput`. This is MANDATORY.
22. **Expansion Rule (CRITICAL):** For ANY project request, YOU MUST ALWAYS use the high-quality chain: `chatInput` -> `theme` (if UI) -> `promptGenerator` -> `masterPrompt` -> `[Stack Selector]` -> `[Runner Node]` -> `ide` -> `chatOutput`.
22. **Completeness Rule:** All projects MUST be planned as full, production-ready structures. Never generate single-file snippets.
23. **Project Bundling Rule (DEPRECATED):** Don't use `zip` node unless explicitly asked for a download link. Always prefer `ide` for code review.
24. **Technology Strictness:** If 'FastAPI' is selected or requested, the AI must generate code ONLY using FastAPI. DO NOT write generic Python scripts. This applies to all programming stacks (Node.js, Spring Boot, etc.).
25. **Language Rule:** All responses from the `llm` MUST be in **English**, even if the user asks in Tamil or Tanglish.
73. **Browser Automation Rule:** For web visits, screenshots, or scraping, always use the `browser` node. Set `data.mode` to "headed" if visibility is requested.
74. **Automated UI Project Flow:** If the user wants a UI or Dashboard based on automated actions (scraping/loops):
    - Sequence: `chatInput` -> `loop` -> `browser` -> `loop` (to close cycle if repeating) AND `loop` (done) -> `promptGenerator` -> `masterPrompt` -> `reactRunner` -> `chatOutput`.
    - This creates a flow where data is collected first, then structured, then visualized.
26. **Data Source Priority:** 
    - If the user asks for a "Data-driven", "RAG", "Database Search", or "Customer Database" bot, YOU MUST include the `mongoDB` node.
    - If the user asks for a "Normal Chatbot", "General Assistant", or "AI Bot" (without mentioning database/search), DO NOT include `mongoDB`. Connect input directly to `promptTemplate`.
27. **T-Shirt Catalog Bot Rule:**
    - If the user asks for "T-shirt", "catalog", "Instagram", "one-time link", or "product link" bot, use `tshirtCatalog` node and `greeting` node.
    - Flow: `whatsAppInput` -> `mongoDB` (FIND) -> `condition` -> (True path) -> `tshirtCatalog` -> `greeting` -> `whatsAppOutput` -> `mongoDB` (INSERT).
    - `tshirtCatalog` provides `{company_name}` and `{catalog_link}` to the `greeting` node.
    - Set `data.company_name` to "SK Sports Wear" and `data.catalog_link` to "https://sksportswear.com/catalog".

**Visual Layout:**
- Set `position: { "x": 0, "y": 200 }` for the first node.
- Increment `x` by 300 for each subsequent node in the main path.
- Place the Config Node (Gemini/OpenAI) above the LLM node (same `x` as LLM, but `y: 0`).

**MongoDB Node & Data Structure Details:**
- `mongoDB`: Use this node for any database operations (Users, Orders, Inventory, etc.).
- **Dataset Structure (General RAG):**
    - The retrieved data is available in the `{context}` placeholder for the next nodes.
    - If no data is found, the system provides a clear "No matching data" message.
- **CRITICAL RAG RULE:** Any flow using `mongoDB` or `search` or `knowledge` MUST connect to a `promptTemplate` node before the `llm` node.
- **TEMPLATE MANDATE:** The `promptTemplate` MUST use the placeholder {context} for the retrieved data and {input} for the user's question.
- **LANGUAGE MANDATE:** The template MUST end with: "Answer only in English regardless of the question language."
- **Example Template:** "Using this data: {context}. Question: {input}. Answer correctly in English."

**Default Templates:**
- For SK Sports Wear / T-Shirt: No AI Prompt required. Use the `greeting` node which already contains the 10 authorized templates.
- For General RAG: "Assistant Role: Professional Assistant. Data: {context}. User: {input}. Answer correctly based on data. Provide source URL if available."
- For emails: "Draft a professional email based on this: {input}"

**Output Format (STRICT JSON):**
{
  "nodes": [
    { "id": "1", "type": "whatsAppInput", "position": { "x": 0, "y": 200 }, "data": { "label": "WhatsApp Trigger" } },
    ...
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2" },
    ...
  ]
}

**User Request:** {user_request}

Generate the JSON flow:"""

class FlowGeneratorService:
    def __init__(self):
        self.gemini = GeminiService()

    async def generate_flow(self, user_request: str) -> Dict[str, Any]:
        prompt = AI_ARCHITECT_PROMPT.replace("{user_request}", user_request)
        
        # Priority: OpenAI (Confirmed working in test_ai.py)
        # Gemini is currently 404ing or returning empty.
        
        try:
            # Try EACH provider in priority until one succeeds
            providers = [
                ("OpenAI", self._generate_with_openai),
                ("Gemini", self._generate_with_gemini)
            ]
            
            last_error = ""
            for name, generator in providers:
                try:
                    print(f"🚀 [FLOW GENERATOR] Generating with {name}...")
                    text = await generator(prompt)
                    if text:
                        result = self._parse_and_clean(text)
                        print(f"✨ [FLOW GENERATOR] Successfully parsed JSON with {len(result.get('nodes', []))} nodes")
                        return result
                except Exception as e:
                    last_error = str(e)
                    print(f"⚠️ {name} failed: {last_error}")
                    continue
            
            raise Exception(f"All AI providers failed. Last error: {last_error}")
            
        except Exception as e:
            print(f"❌ [CRITICAL] Flow generation failed: {str(e)}")
            raise e

    async def _generate_with_openai(self, prompt: str) -> str:
        from app.services.llm_service import llm_service
        print("🤖 [OPENAI] Requesting completion...")
        
        # Run sync call in a thread to avoid blocking the event loop
        completion = await asyncio.to_thread(
            llm_service.chat_completion,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=2048
        )
        
        text = completion.get("text", "")
        print(f"✅ [OPENAI] Response received ({len(text)} chars)")
        return text

    async def _generate_with_gemini(self, prompt: str) -> str:
        response = self.gemini.generate_text(
            prompt=prompt,
            temperature=0.2,
            max_tokens=2048
        )
        return response.get("text", "")

    def _parse_and_clean(self, text: str) -> Dict[str, Any]:
        print("🧹 [PARSER] Cleaning AI response...")
        cleaned_text = text.strip()

        if "```" in cleaned_text:
            parts = cleaned_text.split("```")
            for part in parts:
                p_strip = part.strip()
                if p_strip.startswith("{") or p_strip.startswith("json"):
                    cleaned_text = p_strip.replace("json", "", 1).strip()
                    break
                elif "nodes" in p_strip and "edges" in p_strip:
                    cleaned_text = p_strip
                    break
        
        start = cleaned_text.find("{")
        end = cleaned_text.rfind("}")
        if start != -1 and end != -1:
            cleaned_text = cleaned_text[start:end+1]
        
        try:
            print(f"🔍 [PARSER] Text to parse: {cleaned_text[:100]}...")
            return json.loads(cleaned_text)
        except Exception as e:
            print(f"❌ [PARSER] JSON Load failed: {str(e)}")
            print(f"📄 [PARSER] Full problematic text: {cleaned_text}")
            raise e






flow_generator_service = FlowGeneratorService()
