import os
import asyncio
import logging
import subprocess
import threading
import signal
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List, Optional

# Optional import for real PTY support on Windows
try:
    import winpty
    HAS_WINPTY = True
except ImportError:
    HAS_WINPTY = False

router = APIRouter()
logger = logging.getLogger(__name__)

class TerminalManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

manager = TerminalManager()

@router.websocket("/ws/terminal")
async def terminal_websocket(websocket: WebSocket, cwd: Optional[str] = None):
    await manager.connect(websocket)
    
    shell = "powershell.exe" if os.name == "nt" else "bash"
    initial_dir = cwd if cwd and os.path.exists(cwd) else os.getcwd()
    
    # ---------------------------------------------------------
    # MODE 1: REAL PTY (Windows Only with pywinpty)
    # ---------------------------------------------------------
    if os.name == "nt" and HAS_WINPTY:
        logger.info(f"🚀 Starting REAL PTY (winpty) in {initial_dir}")
        try:
            # Spawn real PTY process
            # Note: winpty uses wide strings on Windows
            pty = winpty.PtyProcess.spawn(shell, cwd=initial_dir)
            
            loop = asyncio.get_running_loop()

            def pty_to_ws():
                try:
                    while True:
                        # Blocking read
                        data = pty.read(4096)
                        if not data:
                            break
                        # Send to WS via loop
                        asyncio.run_coroutine_threadsafe(websocket.send_text(data), loop)
                except Exception as e:
                    logger.debug(f"PTY Read Thread Exit: {e}")

            # Start background thread for reading
            thread = threading.Thread(target=pty_to_ws, daemon=True)
            thread.start()

            try:
                while True:
                    # Async receive from WebSocket
                    msg = await websocket.receive_text()
                    if msg:
                        # Direct write to PTY (winpty handles ANSI escapes like Up Arrow natively!)
                        pty.write(msg)
            except WebSocketDisconnect:
                pass
            except Exception as e:
                logger.error(f"PTY Write Error: {e}")
            finally:
                try:
                    pty.terminate()
                except:
                    pass
                return # Exit handler

        except Exception as e:
            logger.error(f"Failed to start WinPty: {e}, falling back...")
            # Fall through to standard mode

    # ---------------------------------------------------------
    # MODE 2: STANDARD PIPED SHELL (Linux or Windows Fallback)
    # ---------------------------------------------------------
    proc = None
    read_tasks = []
    
    try:
        creation_flags = 0
        if os.name == "nt":
            creation_flags = subprocess.CREATE_NEW_PROCESS_GROUP

        try:
            proc = await asyncio.create_subprocess_exec(
                shell,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=initial_dir,
                creationflags=creation_flags
            )

            async def read_stream(stream, ws):
                try:
                    while True:
                        data = await stream.read(1024)
                        if not data: break
                        try:
                            await ws.send_text(data.decode(errors='replace'))
                        except: break 
                except Exception as e:
                    if not isinstance(e, asyncio.CancelledError):
                        logger.debug(f"Standard Stream Read Exit: {str(e)}")

            read_tasks.append(asyncio.create_task(read_stream(proc.stdout, websocket)))
            read_tasks.append(asyncio.create_task(read_stream(proc.stderr, websocket)))

            if os.name == "nt" and proc.stdin:
                proc.stdin.write(b"\r\n")
                await proc.stdin.drain()

            while True:
                data = await websocket.receive_text()
                if data and proc and proc.stdin:
                    # Map \x7f (DEL) to \b (BS) for Windows fallback
                    if data == "\x7f" and os.name == "nt":
                        data = "\b"
                    
                    if data == "\x03" and os.name == "nt":
                        os.kill(proc.pid, signal.CTRL_C_EVENT)
                        continue
                        
                    proc.stdin.write(data.encode())
                    await proc.stdin.drain()

        except NotImplementedError:
            # Threaded fallback for old Windows loops
            p = subprocess.Popen(
                [shell],
                stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                cwd=initial_dir, creationflags=creation_flags, bufsize=0
            )

            def pipe_reader(pipe, ws):
                try:
                    while True:
                        data = pipe.read(1024)
                        if not data: break
                        asyncio.run_coroutine_threadsafe(ws.send_text(data.decode(errors='replace')), asyncio.get_running_loop())
                except: pass

            threading.Thread(target=pipe_reader, args=(p.stdout, websocket), daemon=True).start()
            threading.Thread(target=pipe_reader, args=(p.stderr, websocket), daemon=True).start()

            while True:
                data = await websocket.receive_text()
                if data and p and p.stdin:
                    if data == "\x03":
                        os.kill(p.pid, signal.CTRL_C_EVENT)
                        continue
                    if data == "\x7f" and os.name == "nt":
                        data = "\b"
                    p.stdin.write(data.encode())
                    p.stdin.flush()
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.exception("Terminal Websocket handler error")
    finally:
        manager.disconnect(websocket)
        for task in read_tasks:
            if not task.done(): task.cancel()
        if proc:
            try:
                proc.terminate()
                await asyncio.wait_for(proc.wait(), timeout=1.0)
            except:
                try: proc.kill()
                except: pass
