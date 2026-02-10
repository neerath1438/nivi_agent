# PROMPT: HIGH-RELIABILITY AI SUMMARIZATION BACKEND (PYTHON/FASTAPI)

## Instructions for AI:
Act as a Senior Python Developer. Generate a full, production-ready `main.py` using FastAPI that acts as an AI Summarization engine with an "Intelligent Multi-Key Rotation & Provider Fallback" architecture.

---

## 1. Technical Stack Requirements:
- **Framework:** FastAPI with Uvicorn.
- **AI SDKs:** `google-generativeai` (Gemini), `openai` (GPT).
- **Utilities:** `python-dotenv`, `CORS` initialization.

## 2. Configuration & Environment Variables:
The system MUST load these from a `.env` file:
- `GEMINI_API_KEY`: A comma-separated string of multiple keys (e.g., "key1,key2,key3").
- `OPENAI_API_KEY`: A single OpenAI secret key.
- `LOAD_LOCAL_MODEL`: Boolean flag (Should be false by default).

## 3. Core Logic Algorithm (The Summarize Endpoint):
Create a `/summarize` POST endpoint that receives `{ "text": "string" }` and follows this exact flow:

### Phase A: Gemini Multi-Key Rotation (Priority 1)
1. Split `GEMINI_API_KEY` by comma and strip whitespace.
2. For each key in the list:
    a. Configure `genai` with the current key.
    b. **Auto-Detect Model:** Fetch all available models (`genai.list_models()`).
    c. **Selection Logic:** Look for `gemini-1.5-flash` first, then `gemini-1.5-pro`. If neither exists, pick the first model that supports `generateContent`.
    d. **Try Generation:** Attempt to summarize the text using the selected model.
    e. **Success:** If successful, return the result immediately with `"model_used": "Gemini (model-name)"`.
    f. **Failure:** If the key fails (quota limits, invalidity, etc.), log the error and proceed to the NEXT key in the list.

### Phase B: OpenAI Hybrid Fallback (Priority 2)
1. If all Gemini keys fail OR no Gemini keys are provided:
    a. Check if `OPENAI_API_KEY` exists.
    b. Use `openai` SDK with model `gpt-4o-mini`.
    c. **Success:** Return result with `"model_used": "GPT-4o-mini (Fallback)"`.
    d. **Failure:** Log the error.

### Phase C: Final Error Handling
1. If both Phase A and Phase B fail, return a friendly JSON error: `"summary_text": "All AI providers currently unavailable. Please check quotas."`.

---

## 4. Key Constraints:
- **No Global Init Errors:** Do NOT call `genai.configure()` globally with the full comma-separated string. Only configure keys one-by-one inside the request loop.
- **FastAPI Defaults:** Include CORS for all origins, Pydantic models for request validation, and proper error logging.
- **Efficiency:** The system should prioritize the free tier (Gemini) to minimize user costs.
