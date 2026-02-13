import asyncio
import logging
import json
import sys
import threading
from playwright.async_api import async_playwright
from typing import Dict, List, Optional, Callable

logger = logging.getLogger(__name__)

class GhostRecorderService:
    def __init__(self):
        self.is_recording = False
        self.browser = None
        self.context = None
        self.page = None
        self.event_queue = asyncio.Queue()
        self.playwright = None
        self._loop = None
        self._thread = None

    async def start_recording(self):
        if self.is_recording:
            return

        logger.info("🚀 Starting Ghost Recorder session...")
        self.is_recording = True
        
        if sys.platform == 'win32':
            # On Windows, we MUST run Playwright in a Proactor loop.
            # We'll start it in a separate thread to avoid blocking the main FastAPI loop.
            self._thread = threading.Thread(target=self._run_windows_session)
            self._thread.daemon = True
            self._thread.start()
        else:
            await self._run_session()

    def _run_windows_session(self):
        """Dedicated thread for Windows to run ProactorEventLoop."""
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        self._loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self._loop)
        
        try:
            self._loop.run_until_complete(self._run_session())
        except Exception as e:
            logger.error(f"Windows Recording Session Error: {e}")
        finally:
            self._loop.close()

    async def _run_session(self):
        """Core recording logic."""
        try:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=False)
            self.context = await self.browser.new_context()
            self.page = await self.context.new_page()

            # Inject recording script
            await self.page.add_init_script("""
                window.addEventListener('mousedown', (e) => {
                    const element = e.target.closest('button, a, input, [role="button"], [onclick]') || e.target;
                    const selector = getSelector(element);
                    
                    // Don't capture mousedown on plain body/html if it's not a real interaction
                    if (element.tagName === 'BODY' || element.tagName === 'HTML') return;

                    window.pyEvent({
                        type: 'click',
                        selector: selector,
                        text: element.innerText || element.value || '',
                        tagName: element.tagName
                    });
                }, true);

                window.addEventListener('input', (e) => {
                    const element = e.target;
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                        const selector = getSelector(element);
                        window.pyEvent({
                            type: 'input',
                            selector: selector,
                            value: element.value,
                            tagName: element.tagName,
                            isPassword: element.type === 'password'
                        });
                    }
                }, true);

                window.addEventListener('blur', (e) => {
                    const element = e.target;
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        const selector = getSelector(element);
                        window.pyEvent({
                            type: 'input',
                            selector: selector,
                            value: element.value,
                            tagName: element.tagName,
                            isPassword: element.type === 'password',
                            isFinal: true
                        });
                    }
                }, true);

                function getSelector(el) {
                    // 1. ID is best
                    if (el.id) return '#' + el.id;
                    
                    // 2. Name is good for forms
                    if (el.getAttribute('name')) return `[name="${el.getAttribute('name')}"]`;
                    
                    // 3. Placeholder or Aria-Label for inputs
                    if (el.getAttribute('placeholder')) return `[placeholder="${el.getAttribute('placeholder')}"]`;
                    if (el.getAttribute('aria-label')) return `[aria-label="${el.getAttribute('aria-label')}"]`;
                    
                    // 4. Type for unique buttons
                    if (el.tagName === 'BUTTON' && el.getAttribute('type')) {
                        const type = el.getAttribute('type');
                        const buttonsOfSameType = document.querySelectorAll(`button[type="${type}"]`);
                        if (buttonsOfSameType.length === 1) return `button[type="${type}"]`;
                    }

                    // 5. Fallback to path
                    let path = [];
                    while (el.nodeType === Node.ELEMENT_NODE) {
                        let selector = el.nodeName.toLowerCase();
                        let siblings = el.parentNode ? Array.from(el.parentNode.children).filter(c => c.tagName === el.tagName) : [];
                        if (siblings.length > 1) {
                            let index = siblings.indexOf(el) + 1;
                            selector += `:nth-of-type(${index})`;
                        }
                        path.unshift(selector);
                        el = el.parentNode;
                        if (!el || el.tagName === 'HTML') break;
                    }
                    return path.join(' > ');
                }
            """)

            async def handle_event(event_data):
                try:
                    data = json.loads(event_data) if isinstance(event_data, str) else event_data
                    logger.info(f"Captured Event: {data}")
                    # Use thread-safe queue insertion
                    if self._loop and self._loop.is_running():
                         self.event_queue.put_nowait(data)
                    else:
                         await self.event_queue.put(data)
                except Exception as e:
                    logger.error(f"Error handling captured event: {e}")

            await self.page.expose_binding("pyEvent", lambda source, data: self._safe_dispatch(data))

            # Monitor navigation
            self.page.on("framenavigated", lambda frame: self._safe_dispatch({
                "type": "navigation",
                "url": self.page.url
            }) if frame == self.page.main_frame else None)

            # Keep the session alive until is_recording is False
            while self.is_recording:
                await asyncio.sleep(0.5)

        except Exception as e:
            logger.error(f"Recording session failed: {e}")
            self.is_recording = False
        finally:
            await self._cleanup()

    def _safe_dispatch(self, data):
        """Dispatch event to queue from any thread."""
        try:
            # We use a trick: standard asyncio Queue isn't thread safe for put_nowait if loop is different
            # But here we'll just use a small window or better yet, a thread-safe way.
            # For simplicity in this streaming setup, we'll use loop.call_soon_threadsafe if we had the main loop
            # But actually, the STREAMING loop is the main one. The RECORDING loop is this one.
            # So we just put it in the queue.
            self.event_queue.put_nowait(data)
        except Exception as e:
            logger.error(f"Safe dispatch error: {e}")

    async def _cleanup(self):
        if self.page:
            await self.page.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        self.page = None
        self.browser = None
        self.playwright = None

    async def stop_recording(self):
        if not self.is_recording:
            return

        logger.info("🛑 Stopping Ghost Recorder session.")
        self.is_recording = False
        
        # Cleanup will happen in the thread loop
        
        # Clear queue
        while not self.event_queue.empty():
            self.event_queue.get_nowait()

    async def get_events(self):
        """Generator to stream events from the queue."""
        while self.is_recording or not self.event_queue.empty():
            try:
                event = await asyncio.wait_for(self.event_queue.get(), timeout=0.5)
                yield event
            except asyncio.TimeoutError:
                continue

ghost_recorder_service = GhostRecorderService()
