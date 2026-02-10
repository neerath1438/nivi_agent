import asyncio
import sys
import threading
from typing import Coroutine, Any

def run_in_new_loop(coro: Coroutine) -> Any:
    """
    Runs an async coroutine in a completely fresh event loop in a new thread.
    On Windows, this forces the use of ProactorEventLoop to support Playwright/subprocesses.
    """
    result = {"data": None, "error": None}
    
    def target():
        # Set policy for THIS thread
        if sys.platform == 'win32':
            asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result["data"] = loop.run_until_complete(coro)
        except Exception as e:
            result["error"] = e
        finally:
            loop.close()

    thread = threading.Thread(target=target)
    thread.start()
    thread.join()
    
    if result["error"]:
        raise result["error"]
    return result["data"]
