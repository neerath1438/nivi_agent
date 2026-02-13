import os
import asyncio
import logging
import sys
import time
import threading
from typing import Dict, Any, List, Optional
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from app.runners.base_runner import BaseRunner
from app.utils.async_utils import run_in_new_loop

logger = logging.getLogger(__name__)

class BrowserSession:
    """Container for an active browser session."""
    def __init__(self, playwright, browser: Browser, context: BrowserContext, page: Page, loop: asyncio.AbstractEventLoop, thread: Optional[threading.Thread] = None):
        self.playwright = playwright
        self.browser = browser
        self.context = context
        self.page = page
        self.loop = loop
        self.thread = thread
        self.last_active = time.time()

class BrowserSessionManager:
    """Manages persistent browser sessions for flow runs."""
    _sessions: Dict[str, BrowserSession] = {}
    _lock = threading.Lock()

    @classmethod
    def get_session(cls, run_id: str) -> Optional[BrowserSession]:
        with cls._lock:
            session = cls._sessions.get(run_id)
            if session:
                # Check if loop is still running
                if session.loop.is_running():
                    session.last_active = time.time()
                    return session
                else:
                    # Clean up if loop died
                    logger.warning(f"Session {run_id} loop is not running. Cleaning up.")
                    cls._sessions.pop(run_id)
            return None

    @classmethod
    def set_session(cls, run_id: str, session: BrowserSession):
        with cls._lock:
            cls._sessions[run_id] = session

    @classmethod
    def close_session(cls, run_id: str):
        with cls._lock:
            session = cls._sessions.pop(run_id, None)
            if session:
                try:
                    if session.loop.is_running():
                        asyncio.run_coroutine_threadsafe(cls._cleanup_session(session), session.loop)
                except Exception as e:
                    logger.error(f"Error closing session {run_id}: {e}")

    @staticmethod
    async def _cleanup_session(session: BrowserSession):
        try:
            await session.page.close()
            await session.browser.close()
            await session.playwright.stop()
        except:
            pass
        finally:
            try:
                session.loop.stop()
            except:
                pass

session_manager = BrowserSessionManager()

class BrowserRunner(BaseRunner):
    """
    Runner for standalone browser automation.
    Supports persistent sessions within a flow run.
    """
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Runs the browser automation, reusing sessions if possible."""
        run_id = state.get("run_id", "default")
        session = session_manager.get_session(run_id)
        
        if session:
            print(f"♻️ [BrowserRunner] Reusing existing session for run_id: {run_id}")
            future = asyncio.run_coroutine_threadsafe(
                self._run_on_page(session.page, node_data, state), 
                session.loop
            )
            while not future.done():
                await asyncio.sleep(0.1)
            return future.result()

        # No session exists, start a new one
        if sys.platform == 'win32':
            print("🪟 [BrowserRunner] Starting persistent Proactor loop for Windows.")
            return await self._run_persistent_windows(node_data, state, run_id)
        else:
            return await self._run_new_session(node_data, state, run_id)

    async def _run_persistent_windows(self, node_data: Dict[str, Any], state: Dict[str, Any], run_id: str) -> Dict[str, Any]:
        """Special handler for Windows to keep loop alive in a thread."""
        result = {"data": None, "error": None}
        loop_ready = threading.Event()

        def thread_target():
            asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            async def init_session():
                try:
                    res = await self._run_new_session(node_data, state, run_id, provided_loop=loop)
                    result["data"] = res
                except Exception as e:
                    result["error"] = e
                finally:
                    loop_ready.set()

            loop.create_task(init_session())
            loop.run_forever()
            loop.close()

        thread = threading.Thread(target=thread_target, daemon=True)
        thread.start()
        
        # Wait for the first node to finish or error
        while not loop_ready.is_set():
            await asyncio.sleep(0.1)
            
        if result["error"]:
            raise result["error"]
        return result["data"]

    async def _run_new_session(self, node_data: Dict[str, Any], state: Dict[str, Any], run_id: str, provided_loop=None) -> Dict[str, Any]:
        """Creates a new playwright session."""
        url = node_data.get("url") or state.get("url") or state.get("output", "")
        mode = node_data.get("mode", "headless")
        
        if not url or not isinstance(url, str) or len(url) < 3:
             return {"output": "Error: No valid URL provided", "status": "error"}
        if not url.startswith("http"): url = f"http://{url}"

        is_headless = mode == "headless"
        
        try:
            p = await async_playwright().start()
            print(f"🌐 [BrowserRunner] Launching {mode.upper()} browser for: {url}")
            
            browser = await p.chromium.launch(
                headless=is_headless,
                channel="chrome",
                args=["--window-position=50,50", "--window-size=1280,720"] if not is_headless else [],
                slow_mo=500 if not is_headless else 0
            )
            context = await browser.new_context()
            page = await context.new_page()
            
            # Store session
            loop = provided_loop or asyncio.get_event_loop()
            session = BrowserSession(p, browser, context, page, loop)
            session_manager.set_session(run_id, session)

            print(f"   [BrowserRunner] Loading initial page: {url}")
            await page.goto(url, wait_until="networkidle", timeout=30000)
            
            return await self._run_on_page(page, node_data, state)
        except Exception as e:
            logger.error(f"Browser Runner Error (New Session): {str(e)}")
            return {"output": f"Browser Error: {str(e)}", "status": "error"}

    async def _run_on_page(self, page: Page, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Performs actions on an existing page."""
        action = node_data.get("action", "navigate")
        url = node_data.get("url")
        
        try:
            # Smart Navigation: ONLY for explicit 'navigate' action
            if action == "navigate" and url:
                current_url = page.url.rstrip('/')
                target_url = url.rstrip('/')
                
                if current_url != target_url and not current_url.startswith(target_url):
                    print(f"   [BrowserRunner] Navigating to: {url}")
                    await page.goto(url, wait_until="networkidle", timeout=30000)
                else:
                    print(f"   [BrowserRunner] Already at {url}, skipping navigation.")
            
            result = {"status": "success", "url": page.url}
            selector = node_data.get("selector")
            value = node_data.get("value")
            
            if action == "screenshot":
                os.makedirs("static/screenshots", exist_ok=True)
                filename = f"browser_node_{int(time.time())}.png"
                path = f"static/screenshots/{filename}"
                await page.screenshot(path=path)
                screenshot_url = f"/static/screenshots/{filename}"
                result["screenshot_url"] = screenshot_url
                result["html_content"] = f'### 📸 Browser Screenshot\n\n![Screenshot]({screenshot_url})\n\nURL: {page.url}'
                result["output"] = f"Screenshot captured"
            elif action == "content":
                content = await page.content()
                result["page_content"] = content
                result["output"] = content 
                preview_len = 3000
                preview = content[:preview_len] + "\n...(truncated)" if len(content) > preview_len else content
                result["html_content"] = f"### 📄 Extracted HTML\n\n```html\n{preview}\n```"
            # Manual Mode / Documentation Highlighting Logic
            manual_mode = node_data.get("manualMode", False)
            screenshot_url = None
            
            if manual_mode:
                try:
                    # 1. Highlight element if selector exists (for click/type)
                    if selector:
                        print(f"   [BrowserRunner] Manual Mode: Highlighting {selector}")
                        await page.evaluate("""(sel) => {
                            const el = document.querySelector(sel);
                            if (el) {
                                el.style.outline = '4px solid #ef4444';
                                el.style.outlineOffset = '2px';
                                el.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }""", selector)
                        await asyncio.sleep(0.5) # Let visual settle
                    
                    # 2. Take Snapshot (Captures full page, with highlight if applied)
                    print(f"   [BrowserRunner] Manual Mode: Capturing Snapshot")
                    screenshot_name = f"step_{node_data.get('id', 'temp')}_{int(time.time())}.png"
                    os.makedirs("static/screenshots", exist_ok=True)
                    screenshot_path = f"static/screenshots/{screenshot_name}"
                    await page.screenshot(path=screenshot_path)
                    screenshot_url = f"/static/screenshots/{screenshot_name}"
                    
                    # 3. Clear Highlight before action
                    if selector:
                        await page.evaluate("""(sel) => {
                            const el = document.querySelector(sel);
                            if (el) {
                                el.style.outline = '';
                                el.style.backgroundColor = '';
                            }
                        }""", selector)
                except Exception as ex:
                    logger.warning(f"Manual highlighting/capture failed: {ex}")

            if action == "click":
                if not selector: return {"output": "Error: No selector provided", "status": "error"}
                
                # Validation Logic
                is_strict = node_data.get("strict", False)
                try:
                    print(f"   [BrowserRunner] Validating element: {selector}")
                    await page.wait_for_selector(selector, state="visible", timeout=3000 if is_strict else 30000)
                except Exception:
                    error_msg = f"❌ Error: Element not found or hidden: `{selector}`\nURL: {page.url}"
                    if is_strict:
                        return {"output": error_msg, "status": "error", "html_content": f"### ❌ Execution Failed\n\n{error_msg}"}
                
                print(f"   [BrowserRunner] Clicking element: {selector}")
                await page.click(selector)
                result["output"] = f"Clicked element: {selector}"
                try: await page.wait_for_load_state("networkidle", timeout=5000)
                except: pass
                
            elif action == "type":
                if not selector: return {"output": "Error: No selector provided", "status": "error"}
                
                # Validation Logic
                is_strict = node_data.get("strict", False)
                try:
                    print(f"   [BrowserRunner] Validating input: {selector}")
                    await page.wait_for_selector(selector, state="visible", timeout=3000 if is_strict else 30000)
                except Exception:
                    error_msg = f"❌ Error: Input field not found: `{selector}`\nURL: {page.url}"
                    if is_strict:
                        return {"output": error_msg, "status": "error", "html_content": f"### ❌ Execution Failed\n\n{error_msg}"}
                
                print(f"   [BrowserRunner] Typing into: {selector}")
                await page.fill(selector, str(value or ""))
                result["output"] = f"Typed into: {selector}"
                try: await page.wait_for_load_state("networkidle", timeout=2000)
                except: pass
            
            elif action == "wait":
                duration_val = node_data.get("value") or node_data.get("selector") or "30"
                try: duration = float(duration_val)
                except: duration = 30.0
                print(f"   [BrowserRunner] Waiting for {duration}s as requested...")
                await asyncio.sleep(duration)
                result["output"] = f"Waited for {duration}s"
            
            else:
                result["output"] = f"Browser session active: {page.url}"

            # Update final URL in result
            result["url"] = page.url
            if screenshot_url:
                result["screenshotUrl"] = screenshot_url

            # Common terminal UI Reporting
            status_text = "SUCCESS" if result.get("status") != "error" else "FAILED"
            status_color = "#4ade80" if status_text == "SUCCESS" else "#f87171"
            
            log_entries = [
                f"🌐 Browser Session: {node_data.get('mode', 'headed').upper()}",
                f"📸 Mode: <span style='color: #8b5cf6; font-weight: 700;'>{'MANUAL' if manual_mode else 'AUTOMATION'}</span>",
                f"🔗 Current URL: {page.url}",
                f"🎬 Action: {action.upper()}",
                f"✅ Status: <span style='color: {status_color}; font-weight: 800;'>{status_text}</span>"
            ]
            if screenshot_url:
                log_entries.append(f"🖼️ Step Image: Captured!")
            if result.get("status") == "error":
                 log_entries.append(f"❌ Detail: {result.get('output')}")
            
            display_log = "<br>".join(log_entries)
            terminal_ui = (
                f"### {'✅' if status_text == 'SUCCESS' else '❌'} Browser Status: {status_text} {'📸' if manual_mode else ''}\n\n"
                f'**📟 Automation Logs:**\n'
                f'<div style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: \'Fira Code\', monospace; font-size: 13px; line-height: 1.5; border: 1px solid #333; max-height: 200px; overflow-y: auto;">'
                f"{display_log}"
                f"</div>\n\n"
            )
            result["html_content"] = terminal_ui + (result.get("html_content") or "")
            return result

        except Exception as e:
            logger.error(f"Browser Action Error: {str(e)}")
            return {"output": f"Action Error: {str(e)}", "status": "error"}
                
        except Exception as e:
            logger.error(f"Browser Runner Error: {str(e)}")
            return {"output": f"Browser Error: {str(e)}", "status": "error"}
