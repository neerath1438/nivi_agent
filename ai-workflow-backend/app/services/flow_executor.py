"""Flow execution engine for running node-based workflows."""
import logging
import sys
import asyncio
import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.runners.base_runner import BaseRunner
from app.runners.chat_input_runner import ChatInputRunner
from app.runners.prompt_runner import PromptRunner
from app.runners.openai_runner import OpenAIRunner
from app.runners.gemini_runner import GeminiRunner
from app.runners.claude_runner import ClaudeRunner
from app.runners.llm_runner import LLMRunner
from app.runners.elasticsearch_runner import ElasticsearchRunner
from app.runners.output_runner import OutputRunner
from app.runners.search_runner import SearchRunner
from app.runners.http_runner import HttpRunner
from app.runners.condition_runner import ConditionRunner
from app.runners.pdf_runner import PdfRunner
from app.runners.knowledge_runner import KnowledgeRunner
from app.runners.summarization_runner import SummarizationRunner
from app.runners.document_generator_runner import DocumentGeneratorRunner
from app.runners.email_runner import run as email_run
from app.runners.code_runner import CodeRunner
from app.runners.ui_components_runner import UIComponentsRunner
from app.runners.prompt_generator_runner import PromptGeneratorRunner
from app.runners.master_prompt_runner import MasterPromptRunner
from app.runners.language_runner import LanguageRunner
from app.runners.theme_runner import ThemeRunner
from app.runners.zip_runner import ZipRunner
from app.runners.browser_runner import BrowserRunner
from app.runners.loop_runner import LoopRunner
from app.runners.screenshot_runner import ScreenshotRunner
from app.runners.ide_runner import IDERunner
from app.runners.whatsapp_input_runner import WhatsAppInputRunner
from app.runners.whatsapp_runner import whats_app_runner
from app.runners.mongodb_runner import mongo_db_runner
from app.runners.tshirt_catalog_runner import tshirt_catalog_runner
from app.runners.greeting_runner import greeting_runner
from app.models import Credential, get_db
from app.services.encryption_service import encryption_service

logger = logging.getLogger(__name__)


class FlowExecutor:
    """Executes a flow by running nodes in sequence."""
    
    def __init__(self):
        """Initialize node runners."""
        self.runners = {
            "chatInput": ChatInputRunner(),
            "promptTemplate": PromptRunner(),
            "openai": OpenAIRunner(),
            "gemini": GeminiRunner(),
            "claude": ClaudeRunner(),
            "llm": LLMRunner(),
            "elasticsearch": ElasticsearchRunner(),
            "chatOutput": OutputRunner(),
            "search": SearchRunner(),
            "http": HttpRunner(),
            "condition": ConditionRunner(),
            "pdf": PdfRunner(),
            "knowledge": KnowledgeRunner(),
            "summarization": SummarizationRunner(),
            "documentGenerator": DocumentGeneratorRunner(),
            "email": email_run,
            "whatsAppInput": WhatsAppInputRunner(),
            "whatsAppOutput": whats_app_runner,
            "mongoDB": mongo_db_runner,
            "tshirtCatalog": tshirt_catalog_runner,
            "greeting": greeting_runner,
            "pythonRunner": CodeRunner(),
            "reactRunner": UIComponentsRunner(),
            "uiComponents": UIComponentsRunner(),
            "promptGenerator": PromptGeneratorRunner(),
            "masterPrompt": MasterPromptRunner(),
            "language": LanguageRunner(),
            "frontendLanguage": LanguageRunner(),
            "backendLanguage": LanguageRunner(),
            "theme": ThemeRunner(),
            "zip": ZipRunner(),
            "browser": BrowserRunner(),
            "loop": LoopRunner(),
            "screenshot": ScreenshotRunner(),
            "ide": IDERunner()
        }
    
    async def execute(self, flow_data: Dict[str, Any], user_input: str, initial_state: Dict[str, Any] = None):
        """Execute a complete flow yielding progress events as JSON strings."""
        
        # 0. Windows Specific Asyncio Policy Enforcement & Debug
        if sys.platform == 'win32':
            try:
                from asyncio import WindowsProactorEventLoopPolicy
                policy = asyncio.get_event_loop_policy()
                loop = asyncio.get_event_loop()
                
                logger.info(f"🔍 [DEBUG] Current Policy: {type(policy).__name__}")
                logger.info(f"🔍 [DEBUG] Current Loop: {type(loop).__name__}")

                if not isinstance(policy, WindowsProactorEventLoopPolicy):
                    asyncio.set_event_loop_policy(WindowsProactorEventLoopPolicy())
                    logger.info("[ENGINE] Enforced WindowsProactorEventLoopPolicy.")
                else:
                    logger.info("[ENGINE] Policy is already Proactor.")
                    
                if type(loop).__name__ == "SelectorEventLoop":
                    logger.error("[CRITICAL] Running on SelectorEventLoop! Playwright WILL FAIL.")
            except Exception as e:
                logger.warning(f"[ENGINE] Loop check failed: {e}")

        try:
            nodes = flow_data.get("nodes", [])
            edges = flow_data.get("edges", [])
            
            # Normalization
            for n in nodes: n["id"] = str(n.get("id", ""))
            for e in edges:
                e["source"] = str(e.get("source", ""))
                e["target"] = str(e.get("target", ""))
                e["sourceHandle"] = str(e.get("sourceHandle", "")) if e.get("sourceHandle") else None

            logger.info(f"📊 Flow Execution Start: {len(nodes)} nodes")
            yield json.dumps({"type": "start", "message": f"Starting flow with {len(nodes)} nodes..."})
            
            state = {"input": user_input, "logs": [], "cumulative_html": []}
            if initial_state: state.update(initial_state)

            # Build maps
            node_ids = [n["id"] for n in nodes]
            incoming_counts = {nid: 0 for nid in node_ids}
            outputs_map = {nid: [] for nid in node_ids}
            
            for edge in edges:
                source, target = edge["source"], edge["target"]
                if target in incoming_counts:
                    incoming_counts[target] += 1
                if source in outputs_map:
                    outputs_map[source].append(edge)

            queue = [nid for nid in node_ids if incoming_counts[nid] == 0]
            queue.sort()
            executed_nodes = set()
            active_nodes = set(node_ids)

            while queue:
                node_id = queue.pop(0)
                if node_id in executed_nodes: continue
                
                node = self._find_node(nodes, node_id)
                if not node: continue
                
                node_type = node.get("type", "unknown")
                is_active = node_id in active_nodes
                
                if not is_active:
                    continue
                
                # Signal node start
                yield json.dumps({
                    "type": "node_start", 
                    "node_id": node_id, 
                    "node_type": node_type,
                    "message": f"Executing {node_type}..."
                })
                
                node_data = await self._resolve_credentials(node.get("data", {}))
                node_data["node_id"] = node_id
                
                runner = self.runners.get(node_type)
                result = {}
                
                if runner:
                    try:
                        import inspect
                        logger.info(f"🔄 [ENGINE] Running runner for {node_id} ({node_type})...")
                        if hasattr(runner, 'run'):
                            is_async = inspect.iscoroutinefunction(runner.run)
                            result = await runner.run(node_data, state) if is_async else runner.run(node_data, state)
                        else:
                            result = await runner(node_data, state) if inspect.iscoroutinefunction(runner) else runner(node_data, state)
                        
                        logger.info(f"✅ [ENGINE] Node {node_id} finished. Result status: {result.get('status') if result else 'None'}")
                        
                        state.update(result or {})
                        
                        # Accumulate visuals
                        node_visual = result.get("html_content")
                        if node_visual:
                            state["cumulative_html"].append({
                                "node_id": node_id,
                                "node_type": node_type,
                                "content": node_visual
                            })
                        # Signal node finish
                        logger.info(f"📤 [ENGINE] Yielding node_finish for {node_id}")
                        yield json.dumps({
                            "type": "node_finish",
                            "node_id": node_id,
                            "status": result.get("status", "success"),
                            "result": result
                        })
                        logger.info(f"📥 [ENGINE] Node {node_id} event yielded successfully")
                    except Exception as e:
                        logger.error(f"Error in {node_id}: {e}", exc_info=True)
                        error_msg = str(e)
                        state["logs"].append({"node_id": node_id, "status": "error", "error": error_msg})
                        yield json.dumps({
                            "type": "node_finish",
                            "node_id": node_id,
                            "status": "error",
                            "error": error_msg
                        })
                else:
                    yield json.dumps({
                        "type": "node_finish",
                        "node_id": node_id,
                        "status": "skipped",
                        "message": "No runner found"
                    })

                executed_nodes.add(node_id)
                state["logs"].append({"node_id": node_id, "node_type": node_type, "status": "success"})

                # Handle branching
                chosen_path = str(result.get("path", "")) if result.get("path") else None
                if chosen_path:
                    for edge in outputs_map[node_id]:
                        handle = edge.get("sourceHandle") or edge.get("targetHandle")
                        if handle and str(handle).lower() != str(chosen_path).lower():
                            self._deactivate_recursive(edge["target"], outputs_map, active_nodes)

                # Queue next
                for edge in outputs_map[node_id]:
                    target_id = edge["target"]
                    if target_id in incoming_counts:
                        incoming_counts[target_id] -= 1
                        if incoming_counts[target_id] == 0:
                            queue.append(target_id)

            # Final result yield
            yield json.dumps({
                "type": "final",
                "output": state.get("output", "Flow completed"),
                "logs": state["logs"],
                "state": state
            })

        except Exception as e:
            logger.error(f"❌ Execution Failure: {str(e)}", exc_info=True)
            yield json.dumps({"type": "error", "message": str(e)})

    def _deactivate_recursive(self, node_id, outputs_map, active_nodes):
        """Recursively remove a node and its children from the active set."""
        if node_id not in active_nodes: return
        active_nodes.remove(node_id)
        for edge in outputs_map.get(node_id, []):
            self._deactivate_recursive(edge["target"], outputs_map, active_nodes)
    
    async def _resolve_credentials(self, node_data: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve credential references in node data."""
        credential_id = node_data.get("credentialId")
        if not credential_id:
            return node_data
        
        try:
            db = next(get_db())
            credential = db.query(Credential).filter(Credential.id == credential_id).first()
            if not credential:
                return node_data
            
            decrypted_value = encryption_service.decrypt(credential.encrypted_value)
            updated_data = node_data.copy()
            del updated_data["credentialId"]
            updated_data["apiKey"] = decrypted_value
            return updated_data
        except Exception as e:
            logger.error(f"❌ Error resolving credential: {str(e)}")
            return node_data
        finally:
            db.close()
    
    def _find_node(self, nodes: List[Dict], node_id: str) -> Dict:
        """Find a node by ID."""
        for node in nodes:
            if node.get("id") == node_id:
                return node
        return None


# Global executor instance
flow_executor = FlowExecutor()
