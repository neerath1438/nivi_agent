import os
import logging
from datetime import datetime
from typing import Dict, Any
from app.runners.base_runner import BaseRunner

logger = logging.getLogger(__name__)

try:
    from fpdf import FPDF
except ImportError:
    FPDF = None

class PdfRunner(BaseRunner):
    """Runner for generating PDF documents."""
    
    async def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        title = node_data.get("title", "AI Generated Report")
        
        # Determine content source
        content = state.get("generated_code")
        source_name = "generated_code"
        
        if not content:
            content = state.get("output", "No content available.")
            source_name = "output"

        logger.info(f"📄 [PdfRunner] Processing. Title: {title}, Source: {source_name}, Size: {len(str(content))} chars")
        
        if not FPDF:
            logger.error("❌ [PdfRunner] FPDF library missing.")
            return {"error": "FPDF library not installed", "output": "PDF Error: Library missing", "status": "error"}
            
        try:
            pdf = FPDF()
            pdf.set_auto_page_break(auto=True, margin=15)
            pdf.add_page()
            
            # --- PROFESSIONAL MANUAL LOGIC ---
            is_manual = node_data.get("manual_mode", False) or state.get("manual_mode", False)
            
            # Helper for sanitized text
            def sanitize_text(text):
                if not text: return ""
                replacements = {'\u2022': '-', '\u2013': '-', '\u2014': '-', '\u2018': "'", '\u2019': "'", 
                               '\u201c': '"', '\u201d': '"', '\u2122': '(TM)', '\u00ae': '(R)', 
                               '\u00a9': '(C)', '\u2026': '...'}
                t = str(text)
                for char, rep in replacements.items(): t = t.replace(char, rep)
                try: return t.encode('cp1252', 'replace').decode('cp1252')
                except: return t.encode('ascii', 'replace').decode('ascii')

            # Header
            pdf.set_font("Arial", "B", 20)
            pdf.set_text_color(51, 65, 85) # Slate 700
            pdf.cell(0, 15, sanitize_text(title), ln=True, align="C")
            pdf.ln(5)
            
            pdf.set_font("Arial", "I", 10)
            pdf.set_text_color(100, 116, 139) # Slate 500
            pdf.cell(0, 5, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align="C")
            pdf.ln(10)

            # Detect Manual Steps from state
            # The state might contain 'execution_history' or we can extract from individual node outputs
            steps = state.get("manual_steps", [])
            
            if is_manual and steps:
                logger.info(f"📸 [PdfRunner] Generating Manual with {len(steps)} steps")
                for i, step in enumerate(steps):
                    pdf.set_font("Arial", "B", 14)
                    pdf.set_text_color(139, 92, 246) # Purple 500
                    pdf.cell(0, 10, f"Step {i+1}: {sanitize_text(step.get('action', 'Interaction'))}", ln=True)
                    
                    pdf.set_font("Arial", "", 11)
                    pdf.set_text_color(51, 65, 85)
                    pdf.multi_cell(0, 6, sanitize_text(f"URL: {step.get('url', 'N/A')}\nSelector: {step.get('selector', 'Internal Action')}"))
                    pdf.ln(2)
                    
                    img_path = step.get('screenshot_path') or step.get('screenshotUrl')
                    if img_path:
                        # Convert relative URL to local absolute path
                        # /static/screenshots/foo.png -> static/screenshots/foo.png
                        relative_path = img_path.lstrip('/') if img_path.startswith('/') else img_path
                        # Target absolute path relative to CWD (backend root)
                        local_path = os.path.abspath(relative_path)
                        
                        if os.path.exists(local_path):
                            try:
                                # Scale image to fit page width (170mm out of 210mm A4)
                                pdf.image(local_path, w=170)
                                pdf.ln(5)
                            except Exception as img_err:
                                logger.warning(f"Failed to embed image: {img_err}")
                                pdf.set_font("Arial", "I", 8)
                                pdf.set_text_color(239, 68, 68)
                                pdf.cell(0, 5, f"[PDF Error] Image embedding failed: {str(img_err)}", ln=True)
                        else:
                            logger.warning(f"Screenshot path not found: {local_path}")
                            pdf.set_font("Arial", "I", 8)
                            pdf.set_text_color(239, 68, 68)
                            pdf.cell(0, 5, f"[Manual Debug] Screenshot missing at: {local_path}", ln=True)
                    
                    # Add page break if not the last step
                    if i < len(steps) - 1:
                        pdf.add_page()
            else:
                # Standard Report fallback
                pdf.set_font("Arial", "", 11)
                pdf.set_text_color(0, 0, 0)
                content = state.get("generated_code") or state.get("output") or "No content available."
                pdf.multi_cell(0, 8, sanitize_text(str(content)[:500000]))

            # Save PDF
            output_dir = "static/downloads"
            os.makedirs(output_dir, exist_ok=True)
            filename = f"manual_{int(datetime.now().timestamp())}.pdf" if is_manual else f"report_{int(datetime.now().timestamp())}.pdf"
            filepath = os.path.join(output_dir, filename)
            pdf.output(filepath)
            
            # --- CLOUDINARY INTEGRATION ---
            from app.utils.cloudinary_utils import upload_file
            cloud_url = upload_file(filepath, folder="reports")
            
            public_url = cloud_url if cloud_url else f"/static/downloads/{filename}"
            logger.info(f"✅ [PdfRunner] PDF generated and uploaded: {public_url}")

            # Prepare UI Content
            terminal_ui = (
                f"### 📄 PDF Generated Successfully\n\n"
                f"**Title**: {title}\n"
                f"**File**: `{filename}`\n\n"
                f"#### 🔗 [Download PDF Document]({public_url})"
            )

            return {
                "pdf_url": public_url,
                "output": f"Successfully generated PDF: {title}.",
                "html_content": terminal_ui,
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"❌ [PdfRunner] Crash: {str(e)}", exc_info=True)
            return {
                "error": str(e),
                "output": f"Failed to generate PDF: {str(e)[:100]}...",
                "status": "error"
            }
