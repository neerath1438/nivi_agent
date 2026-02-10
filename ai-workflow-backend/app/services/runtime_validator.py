import os
import shutil
import subprocess
import tempfile
import asyncio
import time
import json
import logging
from typing import Dict, Any, List, Optional
from playwright.sync_api import sync_playwright

logger = logging.getLogger(__name__)

class RuntimeValidator:
    """
    Handles deep runtime verification of React projects.
    Uses sync_playwright inside a thread to avoid asyncio loop conflicts on Windows.
    """

    def __init__(self, port: int = 5174):
        self.port = port
        self.verify_dir = os.path.abspath("static/verify")
        os.makedirs(self.verify_dir, exist_ok=True)

    def _cleanup_port(self):
        """Kills any process running on the verification port (Windows)."""
        try:
            cmd = f"netstat -ano | findstr :{self.port}"
            output = subprocess.check_output(cmd, shell=True).decode()
            for line in output.strip().split('\n'):
                if f":{self.port}" in line:
                    pid = line.strip().split()[-1]
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
        except:
            pass

    async def verify_project(self, files: List[Dict[str, str]], workspace_id: Optional[str] = None, screenshot_path: Optional[str] = None, skip_browser: bool = False, wait_for_server: bool = False) -> Dict[str, Any]:
        """
        Runs the verification loop. 
        Note: Terminal output is streamed to the Server Console for live visibility.
        """
        if workspace_id:
            temp_dir = os.path.join(self.verify_dir, f"ws_{workspace_id}")
            os.makedirs(temp_dir, exist_ok=True)
        else:
            temp_dir = tempfile.mkdtemp(dir=self.verify_dir)

        process = None
        terminal_logs = []

        try:
            print(f"\n" + "="*50)
            print(f"🏗️  [BUILD] Workspace: {os.path.basename(temp_dir)}")
            print("="*50)
            
            # 1. Write Files
            for f in files:
                path = os.path.join(temp_dir, f["path"])
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "w", encoding="utf-8") as file:
                    file.write(f["content"])
            terminal_logs.append("✅ Project structure written to disk.")

            # 2. NPM Install (Reuse if exists)
            has_modules = os.path.exists(os.path.join(temp_dir, "node_modules"))
            print(f"📦 [Step 1/3] {'Skipping' if has_modules else 'Executing'} npm install...")
            terminal_logs.append(f"$ npm install {'(Reusing node_modules)' if has_modules else ''}")
            
            if not has_modules:
                install_proc = subprocess.Popen(
                    ["npm", "install", "--prefer-offline", "--no-audit", "--no-fund"],
                    cwd=temp_dir,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    shell=True
                )
                while True:
                    await asyncio.sleep(0.1)
                    line = install_proc.stdout.readline()
                    if not line and install_proc.poll() is not None: break
                    if line and line.strip(): 
                        print(f"   [NPM] {line.strip()}")
                        terminal_logs.append(line)
                
                if install_proc.returncode != 0:
                    return {"status": "error", "error": "NPM Install Failed", "terminal_output": "".join(terminal_logs)}
                print("✅ [NPM] Dependencies Ready.")
            else:
                print("♻️ [NPM] Reusing existing node_modules.")

            # 3. Start Dev Server
            self._cleanup_port()
            print(f"🚀 [Step 2/3] Starting Vite Server...")
            
            process = subprocess.Popen(
                ["npx", "vite", "--port", str(self.port), "--strictPort"],
                cwd=temp_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                shell=True,
                bufsize=1, # Line buffered
                **( {"creationflags": subprocess.CREATE_NO_WINDOW} if os.name == 'nt' else {} )
            )

            # Background log consumer
            async def log_consumer(proc, logs):
                try:
                    while proc.poll() is None:
                        line = await asyncio.to_thread(proc.stdout.readline)
                        if line:
                            clean_line = line.strip()
                            if clean_line:
                                print(f"   [VITE] {clean_line}")
                                logs.append(line)
                        else:
                            await asyncio.sleep(0.1)
                except Exception as e:
                    print(f"   [VITE ERROR] Log consumer died: {e}")

            # Start log consumption in background
            asyncio.create_task(log_consumer(process, terminal_logs))

            # Wait for server
            ready = False
            for i in range(45):
                await asyncio.sleep(1)
                if process.poll() is not None:
                    print(f"❌ [VITE] Process died prematurely with code {process.returncode}")
                    return {"status": "error", "error": f"Vite process died with code {process.returncode}", "terminal_output": "".join(terminal_logs)}
                
                try:
                    await asyncio.to_thread(self._check_url)
                    ready = True
                    print(f"✅ [VITE] Server is LIVE at http://localhost:{self.port}")
                    break
                except:
                    if i % 10 == 0: print(f"   ... waiting for vite ({i}s/45s) ...")
                    continue

            if not ready:
                return {"status": "error", "error": "Vite Timeout", "terminal_output": "".join(terminal_logs)}

            # 4. Browser Verification (Conditional)
            if not skip_browser:
                print(f"🕵️  [Step 3/3] Launching Visible Chrome Inspection...")
                browser_result = await asyncio.to_thread(self._sync_browser_check, screenshot_path)
                
                browser_errors = browser_result.get("errors", [])
                print("="*50)
                if browser_errors:
                    print(f"⚠️  [VERIFICATION] Failed with {len(browser_errors)} errors.")
                    return {"status": "failed", "errors": browser_errors, "terminal_output": "".join(terminal_logs)}
                
                print("✅ [VERIFICATION] 100% SUCCESS.")
            else:
                print(f"⏩ [Step 3/3] Skipping internal browser verification as requested.")
                terminal_logs.append("⏩ Internal browser verification skipped.")
                
            # Keep server running if requested (wait_for_server)
            if wait_for_server:
                print(f"⏳ [SERVICE] Server will stay active for external nodes at port {self.port}")
                terminal_logs.append(f"⏳ Server active at http://localhost:{self.port}")
                return {"status": "success", "terminal_output": "".join(terminal_logs), "url": f"http://localhost:{self.port}"}

            return {"status": "success", "terminal_output": "".join(terminal_logs)}

        except Exception as e:
            print(f"❌ [CRASH] {str(e)}")
            return {"status": "error", "error": str(e), "terminal_output": "".join(terminal_logs)}
        finally:
            if process and not wait_for_server: 
                self._cleanup_port()
            if not workspace_id and not wait_for_server: 
                await asyncio.sleep(1)
                shutil.rmtree(temp_dir, ignore_errors=True)

    def _check_url(self):
        import urllib.request
        urllib.request.urlopen(f"http://localhost:{self.port}", timeout=2)

    def _sync_browser_check(self, screenshot_path: Optional[str] = None) -> Dict[str, Any]:
        """Synchronous browser check safely run in a thread."""
        errors = []
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=False, args=["--window-position=50,50", "--window-size=1280,720"]) 
                page = browser.new_page()
                
                def log_error(msg):
                    print(f"   ❌ [BROWSER] {msg}")
                    errors.append(msg)

                page.on("pageerror", lambda err: log_error(f"Runtime Error: {err.message}"))
                page.on("console", lambda msg: log_error(f"Console {msg.type.upper()}: {msg.text}") if msg.type == "error" else None)

                try:
                    page.goto(f"http://localhost:{self.port}", wait_until="networkidle", timeout=30000)
                    print("👀 [BROWSER] Page loaded. Watching for 10s...")
                    time.sleep(10)
                    
                    if screenshot_path:
                        print(f"📸 [BROWSER] Taking screenshot -> {screenshot_path}")
                        os.makedirs(os.path.dirname(screenshot_path), exist_ok=True)
                        page.screenshot(path=screenshot_path)
                        
                except Exception as e:
                    log_error(f"Navigation Failed: {str(e)}")
                
                browser.close()
            return {"errors": errors, "screenshot_captured": bool(screenshot_path)}
        except Exception as e:
            return {"errors": [f"Browser Crash: {str(e)}"]}

# Global instance
runtime_validator = RuntimeValidator()
