"""Screenshot runner using Playwright."""
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

class ScreenshotRunner(BaseRunner):
    """
    Runner for capturing high-quality screenshots of URLs.
    """
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Runs the screenshot capture, using an isolated loop on Windows if necessary."""
        if sys.platform == 'win32':
            print("🪟 [ScreenshotRunner] Detected Windows. Using isolated Proactor loop.")
            return run_in_new_loop(self._run_internal(node_data, state))
        else:
            return await self._run_internal(node_data, state)

    async def _run_internal(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Internal execution logic."""
        url = node_data.get("url") or state.get("url")
        if not url:
            return {"output": "No URL provided for screenshot", "status": "error"}

        # Generate unique filename
        node_id = node_data.get("node_id", "default")
        filename = f"capture_{node_id}_{int(time.time())}.png"
        rel_path = f"static/screenshots/{filename}"
        abs_path = os.path.abspath(rel_path)
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        
        screenshot_url = f"/static/screenshots/{filename}"
        
        try:
            async with async_playwright() as p:
                print(f"📸 [ScreenshotRunner] Capturing: {url}")
                # Screenshots are always headless for consistency and speed
                browser = await p.chromium.launch(
                    headless=True,
                    channel="chrome" # Use system's Chrome browser
                )
                page = await browser.new_page()
                
                # Set a standard viewport
                await page.set_viewport_size({"width": 1280, "height": 720})
                
                # Console Logging for Debugging
                page.on("console", lambda msg: print(f"🔍 [SCREENSHOT CONSOLE] {msg.type.upper()}: {msg.text}") if msg.type in ["error", "warning"] else None)
                page.on("pageerror", lambda err: print(f"❌ [SCREENSHOT RUNTIME ERROR] {err.message}"))

                await page.goto(url, wait_until="networkidle", timeout=30000)
                
                # Wait a bit for animations
                await asyncio.sleep(2)
                
                # Take screenshot
                await page.screenshot(path=abs_path, full_page=False)
                
                await browser.close()
                
                # Terminal Log Generation for Node UI
                log_entries = [
                    f"📸 UI Capture Started",
                    f"🔗 Target: {url}",
                    f"🖼️ Resolution: 1280x720",
                    f"✨ Processing: PNG / HD",
                    f"✅ Saved to: {screenshot_url}"
                ]
                display_log = "<br>".join(log_entries)
                terminal_ui = (
                    f"### ✅ Capture Status: SUCCESS\n\n"
                    "**📟 Image Engine Logs:**\n"
                    '<div style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: \'Fira Code\', monospace; font-size: 13px; line-height: 1.5; border: 1px solid #333; max-height: 200px; overflow-y: auto;">'
                    f"{display_log}"
                    "</div>\n\n"
                )
                
                return {
                    "status": "success",
                    "screenshot_url": screenshot_url,
                    "html_content": terminal_ui + f'### 📸 UI Capture\n\n![Screenshot]({screenshot_url})\n\nURL: {url}',
                    "output": f"Screenshot captured successfully",
                    "url": url
                }
                
        except Exception as e:
            logger.error(f"Screenshot Runner Error: {str(e)}")
            return {"output": f"Screenshot Error: {str(e)}", "status": "error"}
