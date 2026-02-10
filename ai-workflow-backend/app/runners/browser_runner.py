"""Browser automation runner using Playwright."""
import os
import asyncio
import logging
import sys
import time
from typing import Dict, Any, List
from playwright.async_api import async_playwright
from app.runners.base_runner import BaseRunner
from app.utils.async_utils import run_in_new_loop

logger = logging.getLogger(__name__)

class BrowserRunner(BaseRunner):
    """
    Runner for standalone browser automation.
    Supports Headed/Headless modes and basic actions.
    """
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Runs the browser automation, using an isolated loop on Windows if necessary."""
        if sys.platform == 'win32':
            print("🪟 [BrowserRunner] Detected Windows. Using isolated Proactor loop.")
            return run_in_new_loop(self._run_internal(node_data, state))
        else:
            return await self._run_internal(node_data, state)

    async def _run_internal(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Internal execution logic."""
        url = node_data.get("url") or state.get("url") or state.get("output", "")
        mode = node_data.get("mode", "headless") # headed or headless
        action = node_data.get("action", "navigate") # navigate, screenshot, content
        
        # Clean up URL
        if not url or not isinstance(url, str) or len(url) < 3:
            return {"output": "Error: No valid URL provided for Browser Node", "status": "error"}
            
        if not url.startswith("http"):
            url = f"http://{url}"

        is_headless = mode == "headless"
        
        try:
            async with async_playwright() as p:
                print(f"🌐 [BrowserRunner] Launching {mode.upper()} browser for: {url}")
                
                browser = await p.chromium.launch(
                    headless=is_headless,
                    channel="chrome", # Use system's Chrome browser as requested
                    args=["--window-position=50,50", "--window-size=1280,720"] if not is_headless else [],
                    slow_mo=500 if not is_headless else 0
                )
                page = await browser.new_page()
                
                print(f"   [BrowserRunner] Loading page...")
                
                # Console Logging for Debugging
                page.on("console", lambda msg: print(f"🔍 [BROWSER CONSOLE] {msg.type.upper()}: {msg.text}") if msg.type in ["error", "warning"] else None)
                page.on("pageerror", lambda err: print(f"❌ [BROWSER RUNTIME ERROR] {err.message}"))

                await page.goto(url, wait_until="networkidle", timeout=30000)
                
                result = {"status": "success", "url": url}
                
                if action == "screenshot":
                    os.makedirs("static/screenshots", exist_ok=True)
                    filename = f"browser_node_{int(time.time())}.png"
                    path = f"static/screenshots/{filename}"
                    await page.screenshot(path=path)
                    screenshot_url = f"/static/screenshots/{filename}"
                    result["screenshot_url"] = screenshot_url
                    result["html_content"] = f'### 📸 Browser Screenshot\n\n![Screenshot]({screenshot_url})\n\nURL: {url}'
                    result["output"] = f"Screenshot captured"
                elif action == "content":
                    content = await page.content()
                    result["page_content"] = content
                    result["output"] = f"Content extracted ({len(content)} chars)"
                else:
                    result["output"] = f"Browser session active: {url}"
                
                if not is_headless:
                    print(f"👀 [BrowserRunner] Headed mode ACTIVE. Keeping window open for 15s...")
                    await asyncio.sleep(15)
                    print(f"👋 [BrowserRunner] Closing visible browser.")
                    
                await browser.close()
                
                # Terminal Log Generation for Node UI
                log_entries = [
                    f"🌐 Browser Session: {mode.upper()}",
                    f"🔗 URL: {url}",
                    f"🎬 Action: {action.upper()}",
                    f"✅ Status: SUCCESS"
                ]
                display_log = "<br>".join(log_entries)
                terminal_ui = (
                    f"### ✅ Browser Status: SUCCESS\n\n"
                    "**📟 Automation Logs:**\n"
                    '<div style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: \'Fira Code\', monospace; font-size: 13px; line-height: 1.5; border: 1px solid #333; max-height: 200px; overflow-y: auto;">'
                    f"{display_log}"
                    "</div>\n\n"
                )
                
                if "html_content" in result:
                    result["html_content"] = terminal_ui + result["html_content"]
                else:
                    result["html_content"] = terminal_ui
                    
                return result
                
        except Exception as e:
            logger.error(f"Browser Runner Error: {str(e)}")
            return {"output": f"Browser Error: {str(e)}", "status": "error"}
