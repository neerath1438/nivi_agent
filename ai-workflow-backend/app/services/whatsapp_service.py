import os
import subprocess
import requests
import logging
import time
import threading
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class WhatsAppService:
    def __init__(self, bridge_path: str = None, port: int = 3001):
        # Calculate absolute path to bridge directory
        if bridge_path is None:
            backend_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            project_root = os.path.dirname(backend_root)
            self.bridge_path = os.path.join(project_root, "whatsapp_bridge")
        else:
            self.bridge_path = bridge_path
            
        self.port = port
        self.base_url = f"http://localhost:{port}"
        self.process = None
        self._start_bridge_in_background()

    def _start_bridge_in_background(self):
        """Starts the Node.js bridge in a separate thread/process."""
        def run_bridge():
            try:
                # Check if node_modules exists
                if not os.path.exists(os.path.join(self.bridge_path, "node_modules")):
                    logger.error(f"node_modules not found in {self.bridge_path}. Please run npm install.")
                    return

                logger.info(f"🚀 Starting WhatsApp Bridge on port {self.port}...")
                self.process = subprocess.Popen(
                    ["node", "index.js"],
                    cwd=self.bridge_path,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    encoding='utf-8',
                    errors='replace'
                )
                
                for line in iter(self.process.stdout.readline, ""):
                    logger.info(f"[WA Bridge] {line.strip()}")
            except Exception as e:
                logger.error(f"❌ Failed to start WhatsApp Bridge: {str(e)}")

        thread = threading.Thread(target=run_bridge, daemon=True)
        thread.start()

    def get_status(self) -> Dict[str, Any]:
        """Gets the connection status and QR code from the bridge."""
        try:
            response = requests.get(f"{self.base_url}/status", timeout=5)
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            logger.error(f"Error getting bridge status: {str(e)}")
            # If bridge unreachable, try to restart it
            logger.info("⚡ Bridge unreachable, attempting restart...")
            self._start_bridge_in_background()
            
        return {"status": "connecting", "message": "Bridge is starting up..."}

    def send_message(self, to: str, message: str) -> bool:
        """Sends a message via the WhatsApp bridge."""
        try:
            # Ensure the JID is formatted correctly
            if "@" not in to:
                to = f"{to}@s.whatsapp.net"
                
            response = requests.post(
                f"{self.base_url}/send",
                json={"to": to, "message": message},
                timeout=20
            )
            
            if response.status_code == 428 or response.status_code == 401:
                logger.error(f"❌ WhatsApp connection lost ({response.status_code}). Please re-scan QR code if needed.")
                # We could trigger a restart, but usually Baileys handles reconnects unless the session is dead
                return False
                
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Error sending WhatsApp message: {str(e)}")
            return False

    def reset_bridge(self):
        """Kills the bridge, clears auth data, and restarts."""
        logger.info("🔄 Resetting WhatsApp Bridge...")
        
        # Kill process
        if self.process:
            try:
                self.process.terminate()
                self.process.wait(timeout=5)
            except:
                if self.process:
                    self.process.kill()
        
        # Delete auth folder
        auth_path = os.path.join(self.bridge_path, "auth_info_baileys")
        if os.path.exists(auth_path):
            import shutil
            try:
                shutil.rmtree(auth_path)
                logger.info("🗑️ Cleared auth_info_baileys folder")
            except Exception as e:
                logger.error(f"Failed to delete auth folder: {e}")

        # Restart
        self._start_bridge_in_background()
        return True

# Global instance
whatsapp_service = WhatsAppService()
