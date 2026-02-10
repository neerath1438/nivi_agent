import logging
import json
import os
import re
import time
from typing import Dict, Any, List
from app.runners.base_runner import BaseRunner
from app.services.llm_service import LLMService
from app.services.runtime_validator import runtime_validator

logger = logging.getLogger(__name__)

class UIComponentsRunner(BaseRunner):
    """
    Runner for generating high-quality UI projects with EXPLICIT CSS enforcement.
    Features: Auto-Stubbing (Auto-fix missing configs) and Kutty Terminal UI.
    """

    HARMONIZED_VERSIONS = {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "vite": "^5.0.0",
        "@vitejs/plugin-react": "^4.2.0",
        "lucide-react": "^0.447.0",
        "framer-motion": "^11.0.0",
        "react-router-dom": "^6.22.0",
        "axios": "^1.6.0",
        "tailwindcss": "^3.4.0",
        "postcss": "^8.4.0",
        "autoprefixer": "^10.4.0",
        "clsx": "^2.1.0",
        "tailwind-merge": "^2.2.0",
        "recharts": "^2.12.0",
        "date-fns": "^3.3.0"
    }

    # DEFAULT TEMPLATES for Auto-Stubbing (Guaranteed Build Layer)
    DEFAULTS = {
        "package.json": json.dumps({
            "name": "vite-react-project",
            "private": True,
            "version": "0.0.0",
            "type": "module",
            "scripts": {
                "dev": "vite",
                "build": "vite build",
                "preview": "vite preview"
            },
            "dependencies": {},
            "devDependencies": {}
        }, indent=2),
        "vite.config.js": 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()] });',
        "tailwind.config.js": 'module.exports = { content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], theme: { extend: {} }, plugins: [] };',
        "postcss.config.js": 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };',
        "index.html": '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>SaaS Dashboard</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>',
        "src/main.jsx": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);",
        "src/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;"
    }

    def _clean_json(self, raw_str: str) -> str:
        if not raw_str: return ""
        print(f"📦 [UI Runner] Cleaning JSON (Input Len: {len(raw_str)})")
        # Log first/last bits to see if truncated
        print(f"   [UI Runner] Prefix: {raw_str[:70]}...")
        print(f"   [UI Runner] Suffix: ...{raw_str[-70:]}")

        # Aggressive JSON extraction (find first '{' or '[' and last '}' or ']')
        first_bracket = min([i for i in [raw_str.find("{"), raw_str.find("[")] if i != -1] or [-1])
        last_bracket = max([i for i in [raw_str.rfind("}"), raw_str.rfind("]")] if i != -1] or [-1])
        
        if first_bracket != -1 and last_bracket != -1 and last_bracket > first_bracket:
            raw_str = raw_str[first_bracket:last_bracket+1]
        
        # Strip comments
        raw_str = re.sub(r'//.*', '', raw_str)
        raw_str = re.sub(r'/\*.*?\*/', '', raw_str, flags=re.DOTALL)
        # Fix trailing commas
        raw_str = re.sub(r',\s*([\]\}])', r'\1', raw_str)
        return raw_str.strip()

    def _recursive_extract_files(self, data: Any) -> List[Dict[str, str]]:
        """Searches deep into a JSON object to find a list of project files."""
        if isinstance(data, list):
            # Check if this looks like our file list
            if len(data) > 0 and isinstance(data[0], dict) and ("path" in data[0] or "filename" in data[0]):
                return data
            return []
        
        if isinstance(data, dict):
            # 1. Look for known keys
            for key in ["files", "project_files", "structure", "code"]:
                if key in data and isinstance(data[key], list):
                    res = self._recursive_extract_files(data[key])
                    if res: return res
            
            # 2. Brute force search all values
            for value in data.values():
                if isinstance(value, (dict, list)):
                    res = self._recursive_extract_files(value)
                    if res: return res
        return []

    def _harmonize_dependencies(self, files: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Ensures core stack and scripts exist in package.json."""
        for f in files:
            if f.get("path") == "package.json":
                try:
                    data = json.loads(f.get("content", "{}"))
                    deps = data.get("dependencies", {})
                    dev_deps = data.get("devDependencies", {})
                    scripts = data.get("scripts", {})
                    
                    # 1. Ensure scripts exist (Fix for "Missing script: dev")
                    if "dev" not in scripts: scripts["dev"] = "vite"
                    if "start" not in scripts: scripts["start"] = "vite"
                    if "build" not in scripts: scripts["build"] = "vite build"
                    data["scripts"] = scripts

                    # 2. Mandatory list that MUST be present for build to succeed
                    mandatory_core = ["react", "react-dom", "lucide-react", "framer-motion", "react-router-dom", "clsx", "tailwind-merge"]
                    mandatory_dev = ["vite", "@vitejs/plugin-react", "tailwindcss", "postcss", "autoprefixer"]

                    modified = True # Force update scripts anyway
                    # 3. Check all files for imports of harmonized libraries
                    all_content = "\n".join([f.get("content", "") for f in files])
                    for lib, version in self.HARMONIZED_VERSIONS.items():
                        if lib in all_content and lib not in deps and lib not in dev_deps:
                            if lib in ["vite", "@vitejs/plugin-react", "tailwindcss", "postcss", "autoprefixer"]:
                                dev_deps[lib] = version
                            else:
                                deps[lib] = version
                            modified = True
                            print(f"🔧 [UI Runner] Injected missing dependency: {lib}")
                    
                    # 4. Update/Add Mandatory Core & Dev Deps
                    for lib in mandatory_core + mandatory_dev:
                        version = self.HARMONIZED_VERSIONS.get(lib, "latest")
                        target_dict = dev_deps if lib in mandatory_dev else deps
                        if target_dict.get(lib) != version:
                            target_dict[lib] = version
                            modified = True
                    
                    if modified:
                        data["dependencies"] = deps
                        data["devDependencies"] = dev_deps
                        f["content"] = json.dumps(data, indent=2)
                except Exception as e:
                    print(f"⚠️ [UI Runner] Failed to harmonize package.json: {str(e)}")
        return files

    def _apply_auto_stubbing(self, files: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Ensures mandatory config files exist and are valid by injecting defaults or fixing content."""
        paths = {f.get("path") for f in files}
        system_logs = []
        for path, content in self.DEFAULTS.items():
            if path not in paths:
                files.append({"path": path, "content": content})
                system_logs.append(f"Auto-Stubbed: Missing {path} injected.")
                print(f"🔧 [UI Runner] Fixed missing config: {path}")
            else:
                # Content Validation for existing crucial files
                for f in files:
                    if f["path"] == "index.html" and path == "index.html":
                        c = f["content"]
                        modified = False
                        
                        # Use regex for case-insensitive and whitespace resilient checks
                        if not re.search(r'id=["\']root["\']', c):
                            print("🔧 [UI Runner] Adding missing #root div...")
                            c = re.sub(r'(<body.*?>)', r'\1\n    <div id="root"></div>', c, flags=re.IGNORECASE)
                            modified = True
                        
                        if not re.search(r'src=["\'].*?main\.jsx["\']', c):
                            print("🔧 [UI Runner] Adding missing main.jsx script tag...")
                            if "</body>" in c.lower():
                                c = re.sub(r'(</body>)', r'    <script type="module" src="/src/main.jsx"></script>\n\1', c, flags=re.IGNORECASE)
                            else:
                                c += '\n<script type="module" src="/src/main.jsx"></script>'
                            modified = True
                            
                        if modified:
                            f["content"] = c
                            print("🔧 [UI Runner] ✅ index.html DEEP REPAIR COMPLETE")
                            
                    elif f["path"] == "src/index.css" and path == "src/index.css":
                        if "@tailwind" not in f["content"]:
                            f["content"] = self.DEFAULTS["src/index.css"] + "\n\n" + f["content"]
                            print("🔧 [UI Runner] Injected missing Tailwind directives into index.css")
        return files, system_logs

    def _verify_imports(self, files: List[Dict[str, str]]) -> str:
        file_paths = {f.get("path") for f in files}
        errors = []
        for f in files:
            path = f.get("path", "")
            content = f.get("content", "")
            if not path.endswith((".jsx", ".js", ".css")): continue
            import_matches = re.findall(r'from\s+[\'"](.*?)[\'"]|import\s+[\'"](.*?)[\'"]', content)
            for match in import_matches:
                rel_path = match[0] or match[1]
                if not rel_path or not rel_path.startswith("."): continue
                base_dir = os.path.dirname(path)
                target_path = os.path.normpath(os.path.join(base_dir, rel_path)).replace("\\", "/")
                possible_paths = [target_path, target_path + ".jsx", target_path + ".js", target_path + ".css"]
                if not any(p in file_paths for p in possible_paths):
                    errors.append(f"Broken Local Import: {path} -> {rel_path}")
        return "\n".join(errors)

    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        prompt = state.get("prompt", state.get("input", ""))
        theme = state.get("selected_theme", "Glassmorphism")
        stack = state.get("frontend_stack", "React + Tailwind")
        
        if not prompt: return {"output": "Error: No prompt provided", "status": "error"}

        service = LLMService(api_key=state.get("apiKey"))
        
        # SYSTEM PROMPT (Enforcing "WOW" Aesthetics and Component Modularity)
        system_prompt = (
            f"You are a World-Class Senior Frontend Architect & UI Designer. Your goal is to WOW the user with a premium {theme} design using {stack}.\n\n"
            "VISUAL EXCELLENCE MANDATES:\n"
            "1. USE RICH AESTHETICS: Implement vibrant colors, gradients, smooth transitions, and glassmorphism. Avoid plain white/gray backgrounds unless they are part of a sophisticated layout.\n"
            "2. COMPONENT-BASED: Every major section (Sidebar, Navbar, Hero, Stats, Chart, Table, Footer) MUST be a separate file in src/components/.\n"
            "3. TAILWIND PRO: Use complex Tailwind utility classes for depth (shadow-xl, backdrop-blur, hover:scale-105, etc.).\n"
            "4. LUCI-REACT & RECHARTS: Use Lucide-React for all icons and Recharts for beautiful data visualizations.\n"
            "5. NO PLACEHOLDERS: Write real functional components with mock data. Use complex layouts (Grid/Flex) and responsive design.\n\n"
            "MANDATORY FILE STRUCTURE & INTEGRITY:\n"
            "- package.json, vite.config.js, tailwind.config.js, postcss.config.js, index.html\n"
            "- src/main.jsx, src/App.jsx, src/index.css (MUST include @tailwind directives)\n"
            "- index.html MUST contain `<div id=\"root\"></div>` AND `<script type=\"module\" src=\"/src/main.jsx\"></script>`.\n"
            "- App.jsx must export a default component and mount to #root via main.jsx.\n\n"
            "CRITICAL OUTPUT FORMAT:\n"
            "You MUST return ONLY a JSON array of file objects. NO preamble, NO markdown blocks, NO nesting inside other objects.\n"
            "Format: [{\"path\": \"src/App.jsx\", \"content\": \"...\"}, ...]\n"
            "If the UI looks simple, is missing files, or fails to mount, you have FAILED."
        )
        
        system_logs = []
        runtime_result = {"status": "skipped", "terminal_output": "Build skipped."}
        files = []
        
        try:
            response = service.chat_completion(
                messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": f"Project: {prompt}"}],
                model=state.get("model", "gpt-4o-mini"),
                temperature=0.2,
                max_tokens=8000 # Increased for larger projects
            )
            
            # Check for token issues
            if response.get("finish_reason") == "length":
                print("⚠️ [UI Runner] CRITICAL: AI Token Limit Exceeded (Truncated Response)")
                system_logs.append("⚠️ ERROR: AI response was truncated due to token limits. Some files may be missing or broken.")

            raw_content = self._clean_json(response.get("text", "").strip())
            
            max_attempts, current_attempt = 3, 1
            
            while current_attempt <= max_attempts:
                print(f"🔍 [UI Runner] Verification Pass {current_attempt}...")
                error_log, files = "", []
                try:
                    data = json.loads(raw_content)
                    files = self._recursive_extract_files(data)
                    
                    if not files:
                        error_log = "FATAL: Could not find project file array in AI response."
                        print(f"❌ [UI Runner] {error_log}")
                    else:
                        print(f"✅ [UI Runner] Successfully extracted {len(files)} files.")

                    # Path Normalization & Root Enforcement
                    for f in files:
                        # Allow both 'filename' and 'path'
                        p = (f.get("path") or f.get("filename") or "").replace("\\", "/").strip("./")
                        # If a mandatory config is in a subdirectory, move it to root
                        for top_file in ["package.json", "vite.config.js", "tailwind.config.js", "postcss.config.js", "index.html"]:
                            if p.endswith(f"/{top_file}"):
                                p = top_file
                        f["path"] = p

                    files, stubs = self._apply_auto_stubbing(files)
                    files = self._harmonize_dependencies(files)
                    system_logs.extend(stubs)
                except Exception as e: 
                    error_log = f"FATAL: JSON Structure is invalid or truncated. Error: {str(e)}"

                if not error_log:
                    import_errors = self._verify_imports(files)
                    if import_errors: error_log += import_errors

                    if not error_log:
                        # Generate screenshot path
                        node_id = node_data.get("node_id", "default")
                        screenshot_filename = f"ss_{node_id}_{int(time.time())}.png"
                        screenshot_rel_path = f"static/screenshots/{screenshot_filename}"
                        screenshot_abs_path = os.path.abspath(screenshot_rel_path)
                        
                        runtime_result = await runtime_validator.verify_project(
                            files, 
                            workspace_id=node_id,
                            skip_browser=True,     # New flag: Don't open browser internally
                            wait_for_server=True   # New flag: Keep server alive for next nodes
                        )
                        
                        if runtime_result["status"] != "success":
                            error_log += f"\n--- BUILD FEEDBACK ---\n"
                            if "error" in runtime_result: error_log += f"{runtime_result['error']}\n"
                            if "errors" in runtime_result: error_log += "\n".join(runtime_result["errors"])

                if not error_log: break
                
                print(f"⚠️ [UI Runner] Healing Phase (Attempt {current_attempt}/{max_attempts})...")
                healing_prompt = (
                    f"STRICT FIX REQUIRED:\n{error_log}\n\n"
                    "Your previous response had errors. Ensure ALL mandatory files exist and JSON is complete. "
                    "Return ONLY fixed JSON array.\n"
                    f"FAULTY STATE: {raw_content}"
                )
                heal_res = service.chat_completion(
                    messages=[{"role": "user", "content": healing_prompt}], 
                    model=state.get("model", "gpt-4o-mini"),
                    max_tokens=8000 # Increased for larger projects
                )
                
                # Check for token issues during healing
                if heal_res.get("finish_reason") == "length":
                    print("⚠️ [UI Runner] CRITICAL: AI Token Limit Exceeded during healing")
                    system_logs.append("⚠️ ERROR: AI response truncated during healing phase.")

                raw_content = self._clean_json(heal_res.get("text", "").strip())
                current_attempt += 1

            # KUTTY TERMINAL UI GENERATION
            term_log = runtime_result.get("terminal_output", "")
            if system_logs: term_log = "\n".join(system_logs) + "\n" + term_log
            
            final_status = runtime_result.get("status", "failed").upper()
            status_icon = "✅" if final_status == "SUCCESS" else "⚠️" if current_attempt > 1 else "❌"
            
            # Prepare terminal output for HTML
            display_log = term_log.replace('\n', '<br>') if term_log else 'Initializing...' if final_status == 'SKIPPED' else 'Terminal session closed.'
            
            # Embedded Styled Terminal
            terminal_ui = (
                f"### {status_icon} Build Status: {final_status}\n\n"
                "**📟 Build Logs (Port 5174):**\n"
                '<div style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: \'Fira Code\', monospace; font-size: 13px; line-height: 1.5; border: 1px solid #333; max-height: 300px; overflow-y: auto;">'
                f"{display_log}"
                "</div>\n\n"
                "> [!NOTE]\n"
                "> Server is active and waiting for Browser/Screenshot nodes.\n"
            )

            if isinstance(files, list) and len(files) > 0:
                # Ensure we have a valid URL or pass None
                final_url = runtime_result.get("url")
                if not final_url and runtime_result.get("status") == "success":
                    # Fallback if status is success but URL missing (shouldn't happen with Vite)
                    final_url = f"http://localhost:5174"

                return {
                    "project_structure": files,
                    "html_content": f"{terminal_ui}\n\nGenerated **{len(files)}** files.",
                    "output": f"Build: {final_status}",
                    "status": "success",
                    "generated_code": raw_content,
                    "frontend_stack": stack,
                    "url": final_url
                }
            return {"output": "Failed to build valid structure.", "status": "error", "url": None}
        except Exception as e:
            return {"output": f"Execution Crash: {str(e)}", "status": "error"}
