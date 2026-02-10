"""Chat Output node runner - Master Presenter."""
from typing import Dict, Any
from app.runners.base_runner import BaseRunner

class OutputRunner(BaseRunner):
    """
    Final Output runner that surgically combines results.
    Prevents double ZIP links and ensures clean presentation of verified UI projects.
    """
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        # 1. Check for SPECIAL modes (e.g. Email Draft)
        if state.get("type") == "email_draft":
            import json
            return {
                "output": json.dumps({
                    "type": "email_draft",
                    "data": state.get("data", {}),
                    "message": state.get("message", "Draft prepared")
                }),
                "final": True
            }

        # 2. Extract state
        main_output = state.get("output", "")
        zip_url = state.get("zip_url", "")
        cumulative_html = state.get("cumulative_html", [])
        
        # 3. Build Final Presentation
        final_parts = []

        # A. CUMULATIVE NODE RESULTS (Terminal Logs, Preview Images, etc.)
        if cumulative_html:
            for item in cumulative_html:
                final_parts.append(item["content"])
                final_parts.append("\n---\n") # Divider between nodes

        # B. ADDITIONAL UI CONTENT (Legacy support if html_content still exists standalone)
        elif state.get("html_content"):
            final_parts.append(state.get("html_content"))

        # C. ZIP LINK
        if zip_url:
            final_parts.append(f"\n\n### 📦 [Download Project ZIP]({zip_url})")

        # D. FINAL FALLBACK / MAIN OUTPUT
        if not final_parts and main_output:
            final_parts.append(main_output)

        final_msg = "".join(final_parts).strip() or "No output generated."
        
        print(f"📤 Final Presentation: {len(final_msg)} chars.")
        return {
            "output": final_msg,
            "final": True
        }
