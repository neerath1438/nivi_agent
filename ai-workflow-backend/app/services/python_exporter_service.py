import logging
import json
from typing import List, Dict

logger = logging.getLogger(__name__)

class PythonExporterService:
    def __init__(self):
        self.templates = {
            "chatInput": self._gen_chat_input,
            "browser": self._gen_browser,
            "xpathHelper": self._gen_xpath,
            "cssSelector": self._gen_css,
            "jsonPath": self._gen_jsonpath,
            "llm": self._gen_llm,
            "openai": self._gen_config,
            "gemini": self._gen_config,
            "claude": self._gen_config,
            "pdf": self._gen_pdf,
            "chatOutput": self._gen_chat_output,
            "pythonExporter": self._gen_marker
        }

    def export_flow(self, nodes: List[Dict], edges: List[Dict]) -> str:
        """Translate flow to a Python script."""
        try:
            # Build connectivity map
            node_ids = {n["id"] for n in nodes}
            outputs_map = {nid: [] for nid in node_ids}
            for edge in edges:
                source, target = edge["source"], edge["target"]
                if source in outputs_map and target in node_ids:
                    outputs_map[source].append(edge)

            # Determine execution order (simple topological sort for DAG)
            incoming_counts = {nid: 0 for nid in node_ids}
            for edge in edges:
                if edge["target"] in incoming_counts and edge["source"] in node_ids:
                    incoming_counts[edge["target"]] += 1

            queue = [nid for nid in node_ids if incoming_counts[nid] == 0]
            execution_order = []
            while queue:
                current = queue.pop(0)
                execution_order.append(current)
                for edge in outputs_map[current]:
                    target = edge["target"]
                    incoming_counts[target] -= 1
                    if incoming_counts[target] == 0:
                        queue.append(target)

            # Generate script segments
            segments = []
            segments.append(self._gen_header())
            
            for node_id in execution_order:
                node = next((n for n in nodes if n["id"] == node_id), None)
                if not node: continue
                
                node_type = node.get("type")
                if node_type in self.templates:
                    segments.append(self.templates[node_type](node, outputs_map[node_id]))
                else:
                    segments.append(f"    # Node {node_id} ({node_type}) - Not implemented in exporter\n    pass\n")

            segments.append(self._gen_footer())
            
            return "\n".join(segments)

        except Exception as e:
            logger.error(f"Failed to export flow: {e}", exc_info=True)
            return f"# Error exporting flow: {str(e)}"

    def _gen_header(self) -> str:
        return """import asyncio
import json
import logging
from playwright.async_api import async_playwright
from lxml import html
import requests

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def main():
    print(\"🚀 Starting Workflow Execution...\")
    state = {}
"""

    def _gen_footer(self) -> str:
        return """
    print(\"🏁 Workflow execution finished.\")

if __name__ == \"__main__\":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
"""

    def _gen_chat_input(self, node, edges) -> str:
        return f"""
    # 💬 Chat Input
    user_input = input(\"User Input: \")
    state['input'] = user_input
    logger.info(f\"Input received: {{user_input}}\")
"""

    def _gen_browser(self, node, edges) -> str:
        data = node.get("data", {})
        url = data.get("url", "https://google.com")
        action = data.get("action", "extract_html")
        mode = data.get("mode", "headless")
        
        return f"""
    # 🌐 Browser Automation
    print(\"🔍 Navigating to: {url}\")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless={mode == 'headless'})
        page = await browser.new_page()
        await page.goto(\"{url}\")
        
        if \"{action}\" == \"extract_html\":
            state['html_content'] = await page.content()
            logger.info(\"HTML Content extracted ({{len(state['html_content'])}} chars)\")
        
        await browser.close()
"""

    def _gen_xpath(self, node, edges) -> str:
        data = node.get("data", {})
        fields = data.get("fields", [])
        fields_json = json.dumps(fields)
        
        return f"""
    # 🔎 XPATH Helper
    if 'html_content' in state:
        tree = html.fromstring(state['html_content'])
        fields = {fields_json}
        extracted_data = {{}}
        for field in fields:
            name = field.get('name', 'unnamed')
            xpath = field.get('xpath', '')
            results = tree.xpath(xpath)
            extracted_data[name] = [r.text_content().strip() if hasattr(r, 'text_content') else str(r).strip() for r in results]
        
        state['extracted_data'] = extracted_data
        logger.info(f\"Extracted {{len(extracted_data)}} fields via XPATH\")
"""

    def _gen_css(self, node, edges) -> str:
        return "    # CSS Selector (Placeholder)\n    pass\n"

    def _gen_jsonpath(self, node, edges) -> str:
        return "    # JSON Path (Placeholder)\n    pass\n"

    def _gen_llm(self, node, edges) -> str:
        return f"""
    # 🤖 LLM Execute
    prompt = \"Analyze the following data: {{state.get('extracted_data', 'No data found')}}\"
    print(\"🧠 Prompting LLM...\")
    # Note: Replace with actual API call
    state['output'] = f\"[LLM Simulated Response] Based on input: {{state.get('input')}}\"
"""

    def _gen_config(self, node, edges) -> str:
        return f"    # ⚙️ Config: {node.get('type')}\n    pass\n"

    def _gen_pdf(self, node, edges) -> str:
        return f"""
    # 📄 PDF Generator
    print(\"🖨️ Generating PDF report...\")
    # state['pdf_path'] = 'output.pdf'
"""

    def _gen_chat_output(self, node, edges) -> str:
        return f"""
    # ✅ Chat Output
    print(\"\\n--- FINAL RESULT ---\")
    print(state.get('output', 'Execution successful (no output generated)'))
"""

    def _gen_marker(self, node, edges) -> str:
        return "    # 🐍 Python Exporter Marker (Start of script generation context)\n"

python_exporter_service = PythonExporterService()
