import os
import sys
import subprocess
import tempfile
import json
from typing import Dict, Any, List
from app.runners.base_runner import BaseRunner
from app.services.llm_service import LLMService
from app.services.fastapi_validator import FastAPIValidator
from pathlib import Path

# Persistent Virtual Environment Configuration
VENV_PYTHON = r"D:\venvs\latest_2_env\Scripts\python.exe"

class CodeRunner(BaseRunner):
    """Universal Code Runner - generates and executes both Python and Node.js code."""
    
    def _generate_fastapi_success(self, files: List[Dict], validation_result: Dict) -> Dict:
        actual_port = validation_result.get("port", 8000)
        success_message = f"API working on port {actual_port}"
        print(f"[CodeRunner] 🚀 Returning success data to workflow engine...")
        return {
            "project_structure": files,
            "output": f"FastAPI Project validated successfully! {success_message}",
            "validation_result": validation_result,
            "status": "success",
            "api_status": success_message,
            "port": actual_port,
            "endpoints_tested": validation_result.get("endpoints_tested", [])
        }

    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        try:
            prompt = state.get("prompt", state.get("input", ""))
            if not prompt:
                return {"output": "Error: No prompt provided for Code Runner", "status": "error"}

            api_key = state.get("apiKey") if state.get("apiKey") else None
            service = LLMService(api_key=api_key)
            
            backend_lang = state.get("backend_lang", "Python (Standard)")
            is_node = "Node.js" in backend_lang
            is_fastapi = "FastAPI" in backend_lang
            
            if is_node:
                suffix = ".js"
                exec_cmd = ["node"]
            else:
                suffix = ".py"
                # Use persistent VENV if it exists, otherwise fallback to current sys.executable
                python_exe = VENV_PYTHON if os.path.exists(VENV_PYTHON) else sys.executable
                exec_cmd = [python_exe]

            max_retries = 4
            attempt = 0
            error_history = []
            code = ""

            while attempt < max_retries:
                attempt += 1
                
                # 1. Generate or Fix Code
                if attempt == 1:
                    print(f"\n[CodeRunner] 🚀 Starting Initial Generation (Language: {backend_lang})")
                    if is_node:
                        system_prompt = (
                            "You are a professional Node.js developer. "
                            "Write ONLY raw JavaScript code. DO NOT include markdown blocks. "
                            "CRITICAL: The code must PRINT (console.log) a human-readable result. "
                            "If asked for Express, write a simple Express app and include a test block at the end using `http` to trigger an endpoint and console.log the response."
                        )
                    else:
                        if is_fastapi:
                            # Detect database type
                            uses_mongodb = any(keyword in prompt.lower() for keyword in ['mongodb', 'mongo', 'nosql', 'document database'])
                            uses_sql = any(keyword in prompt.lower() for keyword in ['postgresql', 'postgres', 'mysql', 'sqlite', 'sqlalchemy', 'database', 'db'])
                            
                            if uses_mongodb:
                                tech_rules = (
                                    "You are a senior backend architect and FastAPI + MongoDB expert. Generate a COMPLETE, PRODUCTION-STYLE FastAPI backend project.\n\n"
                                    "🚨 CRITICAL PYDANTIC V2 & DRIVER RULES (MUST FOLLOW):\n"
                                    "1. PYDANTIC SETTINGS: Use 'from pydantic_settings import BaseSettings' NOT 'from pydantic import BaseSettings'\n"
                                    "2. REQUIREMENTS: Include 'pydantic-settings' in requirements.txt\n"
                                    "3. ASYNC DRIVER: Use Motor (motor.motor_asyncio.AsyncIOMotorClient) for async MongoDB\n"
                                    "4. NO SYNC DRIVERS: Never use pymongo directly with async code\n"
                                    "5. CONSISTENCY: If using async (AsyncSession), ALL database operations must be async\n\n"
                                    "CRITICAL: You MUST output a JSON array of files following this EXACT MongoDB FastAPI structure:\n\n"
                                    "MANDATORY STRUCTURE (MongoDB):\n"
                                    "app/main.py - FastAPI entry point with app = FastAPI(docs_url='/docs', redoc_url='/redoc')\n"
                                    "app/__init__.py - Empty init file\n"
                                    "app/core/config.py - MongoDB URI, secrets, environment variables (use pydantic BaseSettings)\n"
                                    "app/core/security.py - JWT token creation/validation, password hashing (passlib)\n"
                                    "app/core/__init__.py\n"
                                    "app/api/v1/api_router.py - Central router combining all route modules\n"
                                    "app/api/v1/auth.py - POST /register, POST /login endpoints\n"
                                    "app/api/v1/users.py - User CRUD endpoints (GET, PUT, DELETE)\n"
                                    "app/api/v1/__init__.py\n"
                                    "app/api/__init__.py\n"
                                    "app/models/user_model.py - MongoDB document model (Pydantic with ObjectId)\n"
                                    "app/models/__init__.py\n"
                                    "app/schemas/user_schema.py - Request/Response Pydantic schemas (NO password in response)\n"
                                    "app/schemas/__init__.py\n"
                                    "app/repositories/user_repo.py - MongoDB queries ONLY using Motor async operations\n"
                                    "app/repositories/__init__.py\n"
                                    "app/services/user_service.py - Business logic layer (calls repositories)\n"
                                    "app/services/__init__.py\n"
                                    "app/db/mongodb.py - MongoDB connection using Motor (AsyncIOMotorClient)\n"
                                    "app/db/__init__.py\n"
                                    "requirements.txt - fastapi, uvicorn, motor, pydantic, pydantic-settings, python-jose[cryptography], passlib[bcrypt]\n"
                                    ".env.example - MONGODB_URI, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES\n\n"
                                    "CRITICAL RULES (MongoDB):\n"
                                    "1. ALWAYS create __init__.py in EVERY directory\n"
                                    "2. Use Motor async driver: 'from motor.motor_asyncio import AsyncIOMotorClient'\n"
                                    "3. Models are Pydantic BaseModel (NOT SQLAlchemy) with proper ObjectId handling\n"
                                    "4. Repositories handle ONLY database queries (find, insert_one, update_one, delete_one)\n"
                                    "5. Services contain business logic and call repositories\n"
                                    "6. Routes use dependency injection for services and auth\n"
                                    "7. PYDANTIC V2: Use 'model_config = ConfigDict(from_attributes=True)'\n"
                                    "8. SWAGGER: docs_url='/docs', redoc_url='/redoc' in FastAPI() constructor\n"
                                    "9. Use async/await for ALL database operations\n"
                                    "10. JWT authentication: Protect user routes with Depends(get_current_user)\n"
                                    "11. NEVER return password or hashed_password in API responses\n"
                                    "12. Use proper HTTP status codes (201 for create, 204 for delete, 404 for not found)\n"
                                    "13. Clean architecture: Routes → Services → Repositories → DB\n"
                                    "14. Code must be RUNNABLE without modification - no placeholders, no TODOs\n\n"
                                    "QUALITY STANDARDS:\n"
                                    "- Code should look like written by a senior backend engineer\n"
                                    "- Clean, readable, and maintainable - production-quality\n"
                                    "- Proper error handling and validation\n"
                                    "- Use dependency injection properly\n"
                                    "- Environment variables from .env file\n\n"
                                    "JSON FORMAT: [{\"path\": \"app/main.py\", \"content\": \"...\"}, ...]\n"
                                    "DO NOT provide single-file scripts. REFUSE if user asks for simple code."
                                )
                            elif uses_sql:
                                tech_rules = (
                                    "You are a principal backend architect with deep expertise in FastAPI, clean architecture, and production systems.\n\n"
                                    "🚨 CRITICAL PYDANTIC V2 & DRIVER RULES (MUST FOLLOW):\n"
                                    "1. PYDANTIC SETTINGS: Use 'from pydantic_settings import BaseSettings' NOT 'from pydantic import BaseSettings'\n"
                                    "2. REQUIREMENTS: Include 'pydantic-settings' in requirements.txt\n"
                                    "3. ASYNC DRIVER: Use 'asyncpg' (pip install asyncpg) NOT 'psycopg2' for async PostgreSQL\n"
                                    "4. DRIVER MATCH: If using AsyncSession, use create_async_engine with 'postgresql+asyncpg://...'\n"
                                    "5. CONSISTENCY: If using async (AsyncSession), ALL database operations must be async\n"
                                    "6. NO MIXING: Never mix sync drivers (psycopg2) with async code (AsyncSession)\n\n"
                                    "CRITICAL: You MUST output a JSON array of files following this EXACT ENTERPRISE-GRADE structure:\n\n"
                                    "MANDATORY STRUCTURE (SQL Database - Enterprise):\n"
                                    "app/main.py - FastAPI entry point with app = FastAPI(docs_url='/docs', redoc_url='/redoc')\n"
                                    "app/__init__.py\n"
                                    "app/core/config.py - Environment variables using pydantic BaseSettings\n"
                                    "app/core/security.py - JWT (access + refresh tokens), password hashing (passlib bcrypt)\n"
                                    "app/core/dependencies.py - Global dependencies (get_db, get_current_user, etc.)\n"
                                    "app/core/__init__.py\n"
                                    "app/api/v1/api_router.py - Central router combining all route modules\n"
                                    "app/api/v1/auth.py - POST /register, POST /login, POST /refresh\n"
                                    "app/api/v1/users.py - User CRUD endpoints\n"
                                    "app/api/v1/products.py - Product CRUD endpoints (example business entity)\n"
                                    "app/api/v1/__init__.py\n"
                                    "app/api/__init__.py\n"
                                    "app/models/base.py - SQLAlchemy declarative base\n"
                                    "app/models/user.py - User SQLAlchemy model\n"
                                    "app/models/product.py - Product SQLAlchemy model\n"
                                    "app/models/__init__.py\n"
                                    "app/schemas/user.py - User Pydantic schemas (Create, Update, Response)\n"
                                    "app/schemas/product.py - Product Pydantic schemas\n"
                                    "app/schemas/token.py - Token schemas (access, refresh)\n"
                                    "app/schemas/__init__.py\n"
                                    "app/repositories/user_repo.py - User database queries ONLY (SQLAlchemy)\n"
                                    "app/repositories/product_repo.py - Product database queries\n"
                                    "app/repositories/__init__.py\n"
                                    "app/services/user_service.py - User business logic (calls repositories)\n"
                                    "app/services/product_service.py - Product business logic\n"
                                    "app/services/__init__.py\n"
                                    "app/db/session.py - SQLAlchemy async session and engine\n"
                                    "app/db/base.py - Import all models for Alembic\n"
                                    "app/db/__init__.py\n"
                                    "requirements.txt - fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, alembic, pydantic, pydantic-settings, python-jose[cryptography], passlib[bcrypt], python-dotenv\n"
                                    ".env.example - DATABASE_URL=postgresql+asyncpg://user:pass@localhost/dbname, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES\n"
                                    ".gitignore - Standard Python gitignore\n\n"
                                    "CRITICAL RULES (Enterprise SQL):\n"
                                    "1. ALWAYS create __init__.py in EVERY directory\n"
                                    "2. Use 'app/api/v1/' for API versioning\n"
                                    "3. Repositories handle ONLY database queries (select, insert, update, delete)\n"
                                    "4. Services contain ALL business logic and call repositories\n"
                                    "5. Routes use dependency injection: Depends(get_db), Depends(get_current_user)\n"
                                    "6. PYDANTIC V2: Use 'model_config = ConfigDict(from_attributes=True)' NOT 'orm_mode'\n"
                                    "7. SWAGGER: docs_url='/docs', redoc_url='/redoc'\n"
                                    "8. SQLAlchemy: Use async session (AsyncSession, create_async_engine). CRITICAL: Use 'postgresql+asyncpg' exclusively for PostgreSQL. NEVER use 'psycopg2' with async code.\n"
                                    "9. JWT: Implement both access and refresh tokens\n"
                                    "10. NEVER return password or hashed_password in responses\n"
                                    "11. Use proper HTTP status codes (201 create, 204 delete, 404 not found)\n"
                                    "12. Clean architecture: Routes → Services → Repositories → DB\n"
                                    "13. Environment variables from .env file (use python-dotenv)\n"
                                    "14. Code must be RUNNABLE without modification - no placeholders\n"
                                    "15. Include proper error handling and validation\n\n"
                                    "QUALITY STANDARDS:\n"
                                    "- Enterprise-grade, production-ready code\n"
                                    "- Clean, readable, scalable architecture\n"
                                    "- Suitable for real-world deployment\n"
                                    "- Proper separation of concerns\n"
                                    "- Security best practices\n\n"
                                    "JSON FORMAT: [{\"path\": \"app/main.py\", \"content\": \"...\"}, ...]\n"
                                    "DO NOT provide single-file scripts. REFUSE if user asks for simple code."
                                )
                            else:
                                # Simple API without database (in-memory)
                                tech_rules = (
                                    "You are a senior backend architect. Generate a COMPLETE, PRODUCTION-QUALITY FastAPI project.\n\n"
                                    "🚨 CRITICAL PYDANTIC V2 RULES (MUST FOLLOW):\n"
                                    "1. PYDANTIC V2: Use 'model_config = ConfigDict(from_attributes=True)' NOT 'class Config: orm_mode = True'\n"
                                    "2. IMPORTS: Use 'from pydantic import BaseModel, ConfigDict' for schemas\n"
                                    "3. NO DATABASE: This is an in-memory API, no database drivers needed\n\n"
                                    "CRITICAL: You MUST output a JSON array of files following this SIMPLE FastAPI structure (NO DATABASE):\n\n"
                                    "MANDATORY STRUCTURE (In-Memory API):\n"
                                    "app/main.py - FastAPI entry point with app = FastAPI(docs_url='/docs', redoc_url='/redoc')\n"
                                    "app/__init__.py - Empty init file\n"
                                    "app/api/users.py - User CRUD endpoints (NO v1 folder for simple APIs)\n"
                                    "app/api/__init__.py\n"
                                    "app/schemas/user.py - Pydantic Request/Response schemas\n"
                                    "app/schemas/__init__.py\n"
                                    "app/services/user_service.py - Business logic layer\n"
                                    "app/services/__init__.py\n"
                                    "app/fake_db/user_store.py - In-memory data store (Python dict or list)\n"
                                    "app/fake_db/__init__.py\n"
                                    "requirements.txt - Include: fastapi, uvicorn, pydantic\n\n"
                                    "CRITICAL RULES (Simple API):\n"
                                    "1. ALWAYS create __init__.py in EVERY directory\n"
                                    "2. Use 'app/api/' directly (NO v1 subfolder for simple APIs)\n"
                                    "3. Import format: 'from app.api.users import router'\n"
                                    "4. PYDANTIC V2: Use 'model_config = ConfigDict(from_attributes=True)'\n"
                                    "5. SWAGGER: docs_url='/docs', redoc_url='/redoc' in FastAPI() constructor\n"
                                    "6. Data Storage: Use Python dict/list in fake_db/user_store.py (e.g., users_db = [])\n"
                                    "7. NO database dependencies (no SQLAlchemy, Motor, etc.)\n"
                                    "8. Keep it SIMPLE: Just API endpoints + schemas + services + in-memory store\n"
                                    "9. Separation: Schemas (API) ≠ Services (Logic) ≠ Store (Data)\n"
                                    "10. Code must be RUNNABLE without modification - no placeholders, no TODOs\n"
                                    "11. Professional quality: Clean, readable, production-style code\n"
                                    "12. Include proper error handling (404 for not found, etc.)\n"
                                    "13. Use proper HTTP status codes (201 for create, 204 for delete, etc.)\n\n"
                                    "QUALITY STANDARDS:\n"
                                    "- Code should look like it was written by a senior backend engineer\n"
                                    "- Simple, readable, and clean - no shortcuts, no pseudo-code\n"
                                    "- Avoid unnecessary comments inside code\n"
                                    "- Use clear file boundaries and imports\n"
                                    "- All endpoints must be Swagger-ready\n\n"
                                    "JSON FORMAT: [{\"path\": \"app/main.py\", \"content\": \"...\"}, ...]\n"
                                    "DO NOT provide single-file scripts. REFUSE if user asks for simple code."
                                )
                        else:
                            tech_rules = (
                                "CRITICAL: Write a STANDARD Python script. DO NOT use FastAPI, Flask, or any web framework. "
                                "NEVER use @app.get, @app.post, or FastAPI(). "
                                "Write code that runs directly with `python file.py`. "
                                "Even if the user request says 'API' or 'Framework', write it as a console/terminal application. "
                                "If you MUST use multiple files, use the JSON array format, but the logic must remain a standard script."
                            )
                        
                        system_prompt = (
                            "You are a professional Python engineer. Write ONLY raw Python code or JSON. "
                            f"{tech_rules} Use mock data. No input(). Use sqlite:///:memory:. "
                            "DO NOT include markdown code blocks if you output JSON."
                        )
                    user_msg = f"Write code for: {prompt}"
                else:
                    last_error = error_history[-1]
                    print(f"\n[CodeRunner] 🩹 Attempt {attempt}: Healing error -> {last_error[:100]}...")
                    
                    # For FastAPI projects, include the full project structure in the healing prompt
                    if is_fastapi:
                        system_prompt = (
                            "You are a FastAPI debugging expert. "
                            "I will provide you with the FAILED PROJECT STRUCTURE (JSON array of files) and the ERROR MESSAGE. "
                            "Fix the code and provide the COMPLETE corrected JSON array with ALL files. "
                            "CRITICAL RULES:\n"
                            "1. Output ONLY a valid JSON array of files\n"
                            "2. Each file must have 'path' and 'content' keys\n"
                            "3. The main app MUST be in 'app/main.py' or 'main.py'\n"
                            "4. Include requirements.txt with all dependencies\n"
                            "5. Fix the specific error mentioned\n"
                            "6. Do NOT truncate the JSON - provide the COMPLETE array"
                        )
                        user_msg = f"FAILED PROJECT:\n```json\n{code}\n```\n\nERROR MESSAGE:\n{last_error}\n\nFix the error and provide the COMPLETE corrected JSON array."
                    else:
                        system_prompt = (
                            "You are a debugging expert. "
                            "I will provide you with the FAILED CODE and the ERROR MESSAGE. "
                            "Fix the code and provide the full corrected version ONLY. No explanations. "
                            "CRITICAL: Maintain the same technology stack as requested (e.g., FastAPI, Node.js)."
                        )
                        user_msg = f"FAILED CODE:\n```python\n{code}\n```\n\nERROR MESSAGE:\n{last_error}"
                
                
                response = service.chat_completion(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_msg}
                    ],
                    model=state.get("model", "gpt-4o-mini"),
                    temperature=0,
                    max_tokens=4000
                )
                code = response.get("text", "").strip()
                
                if code.startswith("```"):
                    code = "\n".join(code.split("\n")[1:-1]) if "```" in code[3:] else code[3:]
                code = code.strip()

                if not code:
                    print("[CodeRunner] ❌ AI failed to generate code.")
                    return {"output": "Error: AI failed to generate code", "status": "error"}

                # 1.5 Smart Handling for JSON Project Structures
                potential_json = code.strip()
                
                # Aggressive JSON extraction (find first '[' and last ']')
                first_bracket = potential_json.find("[")
                last_bracket = potential_json.rfind("]")
                
                if first_bracket != -1 and last_bracket != -1 and last_bracket > first_bracket:
                    candidate = potential_json[first_bracket:last_bracket+1]
                    try:
                        files = json.loads(candidate)
                        if isinstance(files, list) and len(files) > 0 and "path" in files[0]:
                            print(f"[CodeRunner] 📁 Detected Multi-file Project ({len(files)} files).")
                            
                            # FastAPI Validation & Self-Healing
                            if is_fastapi:
                                print(f"[CodeRunner] 🔍 FastAPI detected - Starting runtime validation...")
                                
                                # Create temporary project directory
                                with tempfile.TemporaryDirectory() as temp_dir:
                                    # Write all files to temp directory
                                    for file_obj in files:
                                        file_path = os.path.join(temp_dir, file_obj["path"])
                                        os.makedirs(os.path.dirname(file_path), exist_ok=True)
                                        with open(file_path, "w", encoding="utf-8") as f:
                                            f.write(file_obj["content"])
                                    
                                    print(f"[CodeRunner] 📝 Created {len(files)} files in {temp_dir}")
                                    
                                    # Create a dummy .env file to prevent Settings validation errors
                                    env_file = os.path.join(temp_dir, ".env")
                                    if not os.path.exists(env_file):
                                        print("[CodeRunner] 📝 Generating minimalist .env for validation...")
                                        with open(env_file, "w", encoding="utf-8") as f:
                                            # Only add critical ones, others will be added by Smart Healing if needed
                                            f.write("SECRET_KEY=dummy_secret_for_validation_12345\n")
                                            f.write("DATABASE_URL=sqlite:///./test.db\n")
                                            f.write("PORT=8000\n")
                                    
                                    # Install dependencies if requirements.txt exists
                                    req_file = os.path.join(temp_dir, "requirements.txt")
                                    if os.path.exists(req_file):
                                        print(f"[CodeRunner] 📦 Installing dependencies from requirements.txt into {python_exe}...")
                                        subprocess.run(
                                            [python_exe, "-m", "pip", "install", "-r", req_file],
                                            capture_output=True,
                                            timeout=120
                                        )
                                    
                                    # Validate with FastAPIValidator using persistent VENV
                                    validator = FastAPIValidator(port=8000, python_exe=python_exe)
                                    validation_result = validator.validate(temp_dir, max_wait=60)
                                    
                                    if validation_result["success"]:
                                        # Get the actual port used
                                        actual_port = validation_result.get("port", 8000)
                                        success_message = f"API working on port {actual_port}"
                                        
                                        print(f"[CodeRunner] ✅ FastAPI validation passed! {success_message}")
                                        return {
                                            "project_structure": files,
                                            "output": f"FastAPI Project validated successfully! {success_message}",
                                            "validation_result": validation_result,
                                            "status": "success",
                                            "generated_code": candidate,
                                            "api_status": success_message,
                                            "port": actual_port,
                                            "endpoints_tested": validation_result.get("endpoints_tested", [])
                                        }
                                    else:
                                        # Validation failed - analyze error type
                                        print(f"[CodeRunner] ❌ Validation failed: {validation_result['errors']}")
                                        
                                        # Check if it's a package/dependency error
                                        error_text = " ".join(validation_result['errors']).lower()
                                        is_package_error = any(keyword in error_text for keyword in [
                                            "modulenotfounderror", "no module named", 
                                            "importerror", "cannot import",
                                            "package not found", "pip install"
                                        ])
                                        
                                        # Check if it's a Pydantic V1/V2 compatibility error
                                        is_pydantic_error = any(keyword in error_text for keyword in [
                                            "orm_mode", "has been renamed to", "from_attributes",
                                            "field required", "Settings"
                                        ])
                                        
                                        if is_pydantic_error:
                                            # Case 0: Extra inputs forbidden in Settings
                                            if "Extra inputs are not permitted" in error_text:
                                                print("[CodeRunner] 🔧 Auto-fixing strict Settings (extra='ignore')...")
                                                fixed_count = 0
                                                for file_obj in files:
                                                    if "class Settings" in file_obj["content"]:
                                                        content = file_obj["content"]
                                                        if "model_config" not in content and "BaseSettings" in content:
                                                            import re
                                                            # Ensure ConfigDict is available
                                                            if "ConfigDict" not in content:
                                                                content = content.replace("from pydantic import", "from pydantic import ConfigDict, ")
                                                            # Inject extra='ignore'
                                                            content = re.sub(
                                                                r"(class Settings\(BaseSettings\):)",
                                                                r"\1\n    model_config = ConfigDict(extra='ignore')",
                                                                content
                                                            )
                                                            if content != file_obj["content"]:
                                                                file_obj["content"] = content
                                                                fixed_count += 1
                                                
                                                if fixed_count > 0:
                                                    print(f"[CodeRunner] ✅ Fixed 'extra=ignore' in {fixed_count} files, retrying...")
                                                    candidate = json.dumps(files)
                                                    code = candidate
                                                    continue

                                            # Case 1: Missing fields in Settings - try to add to .env
                                            if "validation errors for Settings" in error_text:
                                                import re
                                                # Improved regex: Case-insensitive and handles various layouts
                                                missing_fields = re.findall(r"([a-zA-Z0-9_]+)\n\s*Field required", error_text)
                                                if missing_fields:
                                                    print(f"[CodeRunner] 🔧 Auto-fixing missing Settings fields: {missing_fields}")
                                                    with open(env_file, "a", encoding="utf-8") as f:
                                                        for field in missing_fields:
                                                            f.write(f"{field}=dummy_value_for_{field}\n")
                                                    print(f"[CodeRunner] ✅ Added {len(missing_fields)} fields to .env, retrying validation...")
                                                    validation_result = validator.validate(temp_dir, max_wait=60)
                                                    if validation_result["success"]:
                                                        return self._generate_fastapi_success(files, validation_result)
                                            
                                            # Case 2: Pydantic V1 syntax in Pydantic V2 environment - auto-fix code
                                            print("[CodeRunner] 🔧 Detected Pydantic V1/V2 compatibility issue - auto-fixing syntax...")
                                            fixed_count = 0
                                            for file_obj in files:
                                                content = file_obj["content"]
                                                original_content = content
                                                content = content.replace("orm_mode = True", "from_attributes = True")
                                                content = content.replace("orm_mode=True", "from_attributes=True")
                                                import re
                                                content = re.sub(
                                                    r'class Config:\s*\n\s*orm_mode\s*=\s*True',
                                                    'model_config = ConfigDict(from_attributes=True)',
                                                    content
                                                )
                                                if content != original_content:
                                                    file_obj["content"] = content
                                                    fixed_count += 1
                                            
                                            if fixed_count > 0:
                                                print(f"[CodeRunner] ✅ Auto-fixed Pydantic syntax in {fixed_count} files, retrying validation...")
                                                candidate = json.dumps(files)
                                                code = candidate
                                                continue
                                        
                                        if is_package_error:
                                            # Extract package name and auto-install
                                            print("[CodeRunner] 📦 Detected missing package error - auto-installing...")
                                            
                                            # Try to extract package name
                                            import re
                                            match = re.search(r"no module named ['\"]([^'\"]+)['\"]", error_text)
                                            if match:
                                                package_name = match.group(1).split('.')[0]  # Get base package
                                                print(f"[CodeRunner] 📦 Installing {package_name} into {python_exe}...")
                                                try:
                                                    subprocess.run(
                                                        [python_exe, "-m", "pip", "install", package_name],
                                                        capture_output=True,
                                                        timeout=60
                                                    )
                                                    print(f"[CodeRunner] ✅ Installed {package_name}, retrying validation immediately (No AI healing needed)...")
                                                    # Re-run validation without AI call
                                                    validation_result = validator.validate(temp_dir, max_wait=60)
                                                    if validation_result["success"]:
                                                        # USE THE HELPER TO ENSURE CONSISTENCY AND LOGGING
                                                        return self._generate_fastapi_success(files, validation_result)
                                                except Exception as e:
                                                    print(f"[CodeRunner] ⚠️ Could not auto-install {package_name}: {e}")
                                        
                                        # It's a coding error or persistent dependency error - send to AI for fixing
                                        error_msg = "FastAPI Runtime Validation Errors:\n"
                                        error_msg += "\n".join(f"- {err}" for err in validation_result["errors"])
                                        if validation_result.get("warnings"):
                                            error_msg += "\n\nWarnings:\n"
                                            error_msg += "\n".join(f"- {warn}" for warn in validation_result["warnings"])
                                        
                                        error_history.append(error_msg)
                                        print(f"[CodeRunner] 🔄 Triggering AI self-healing (attempt {attempt}/{max_retries})...")
                                        continue  # Go back to healing loop
                            
                            # Non-FastAPI multi-file projects (no validation needed)
                            return {
                                "project_structure": files,
                                "output": f"Multi-file project generated with {len(files)} files.",
                                "status": "success",
                                "generated_code": candidate
                            }
                    except Exception as e:
                        print(f"[CodeRunner] ⚠️ Found potential JSON but parsing failed: {str(e)}")
                
                # If FastAPI is requested, we MUST have a JSON structure. 
                # If we reached here, it means we don't have valid JSON.
                if is_fastapi:
                    print("[CodeRunner] ⚠️ FastAPI requested but AI didn't provide valid JSON structure. Injecting retry intent...")
                    error_history.append("AI Error: You MUST output a JSON array of files for FastAPI projects. Do not provide a single script. Ensure the JSON is valid and not truncated.")
                    continue

                # 2. Execute Code (with Anti-Web-Framework Guard for Standard Mode)
                if not is_fastapi and not is_node:
                    test_code = code.lower()
                    if "fastapi(" in test_code or "@app." in test_code or "import fastapi" in test_code:
                        print("[CodeRunner] 🛑 Hallucination Detected: Standard mode generated FastAPI code. Forcing heal...")
                        error_history.append("AI Error: You generated FastAPI code but you are in STANDARD PYTHON mode. Do not use frameworks. Write a standard script with print().")
                        continue

                with tempfile.NamedTemporaryFile(suffix=suffix, mode="w", delete=False, encoding="utf-8") as tf:
                    tf.write(code)
                    temp_file_path = tf.name
                
                try:
                    env = os.environ.copy()
                    env["PYTHONIOENCODING"] = "utf-8"
                    backend_node_modules = os.path.join(os.getcwd(), "node_modules")
                    if os.path.exists(backend_node_modules):
                        env["NODE_PATH"] = f"{backend_node_modules}{os.pathsep}{env.get('NODE_PATH', '')}".strip(os.pathsep)

                    print(f"[CodeRunner] ⚡ Executing attempt {attempt}...")
                    result = subprocess.run(
                        exec_cmd + [temp_file_path],
                        capture_output=True, text=True, timeout=30, env=env,
                        stdin=subprocess.DEVNULL,
                        **( {"creationflags": subprocess.CREATE_NO_WINDOW} if os.name == 'nt' else {} )
                    )
                    
                    if result.returncode == 0:
                        output_content = result.stdout.strip() or result.stderr.strip()
                        print(f"[CodeRunner] ✅ Success on attempt {attempt}!")
                        print(f"[CodeRunner] 📥 Output:\n{output_content}\n" + "-"*30)
                        return {
                            "generated_code": code,
                            "output": output_content,
                            "execution_result": output_content,
                            "execution_status": "success",
                            "attempts": attempt,
                            "status": "success"
                        }
                    else:
                        # Clean error message: Remove warnings to let AI focus on real Tracebacks
                        raw_error = result.stderr
                        cleaned_lines = []
                        for line in raw_error.split("\n"):
                            lower_line = line.lower()
                            # Filter out common warnings that don't cause crashes
                            if any(w in lower_line for w in ["warning:", "userwarning:", "deprecationwarning:", "movedin20warning:"]):
                                continue
                            cleaned_lines.append(line)
                        
                        error_to_send = "\n".join(cleaned_lines).strip() or raw_error.strip()
                        
                        print(f"[CodeRunner] ⚠️ Execution failed (Attempt {attempt}): {error_to_send[:100]}...")
                        
                        if "modulenotfounderror: no module named" in error_to_send.lower():
                            package = error_to_send.lower().split("named '")[1].split("'")[0]
                            print(f"[CodeRunner] 📦 Healing Dependencies: Installing {package}...")
                            subprocess.run([sys.executable, "-m", "pip", "install", package], capture_output=True)
                            error_history.append(f"Missing Python package: {package} (Installed, retrying...)")
                            continue 
                        
                        if "cannot find module" in error_to_send.lower() and is_node:
                            try:
                                package = error_to_send.lower().split("module '")[1].split("'")[0]
                                print(f"[CodeRunner] 📦 Healing Dependencies: Installing {package} (NPM)...")
                                subprocess.run(["npm", "install", package], capture_output=True, cwd=os.getcwd())
                                error_history.append(f"Missing Node.js module: {package} (Installed, retrying...)")
                                continue
                            except: pass

                        error_history.append(error_to_send)
                finally:
                    if os.path.exists(temp_file_path): os.remove(temp_file_path)

            print(f"[CodeRunner] ❌ Exhausted all {max_retries} attempts.")

            return {
                "output": f"Failed after {max_retries} attempts. Last error: {error_history[-1]}",
                "status": "error",
                "generated_code": code
            }
        except Exception as e:
            return {"output": f"Error in Code Runner: {str(e)}", "status": "error"}
