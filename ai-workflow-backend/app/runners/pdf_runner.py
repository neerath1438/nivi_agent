import os
from datetime import datetime
from typing import Dict, Any
from app.runners.base_runner import BaseRunner

try:
    from fpdf import FPDF
except ImportError:
    FPDF = None

class PdfRunner(BaseRunner):
    """Runner for generating PDF documents."""
    
    def run(self, node_data: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        title = node_data.get("title", "AI Generated Report")
        
        # Prioritize source code if it's a code-generation flow
        content = state.get("generated_code") or state.get("output", "No content available.")
        
        # If it's code, add a header
        if state.get("generated_code"):
            title = f"Source Code: {title}"
        
        print(f"📄 Generating PDF: {title}")
        
        if not FPDF:
            return {"error": "FPDF library not installed", "output": "PDF Error: Library missing"}
            
        try:
            pdf = FPDF()
            pdf.add_page()
            
            # Title
            pdf.set_font("Arial", "B", 16)
            pdf.cell(0, 10, title, ln=True, align="C")
            pdf.ln(10)
            
            # Date
            pdf.set_font("Arial", "I", 10)
            pdf.cell(0, 10, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
            pdf.ln(5)
            
            # Content
            if state.get("generated_code"):
                pdf.set_font("Courier", size=10)
            else:
                pdf.set_font("Arial", size=12)
            # Multi-cell for wrapping text
            pdf.multi_cell(0, 10, str(content))
            
            # Ensure downloads directory exists
            output_dir = "static/downloads"
            os.makedirs(output_dir, exist_ok=True)
            
            filename = f"report_{int(datetime.now().timestamp())}.pdf"
            filepath = os.path.join(output_dir, filename)
            
            pdf.output(filepath)
            
            public_url = f"/static/downloads/{filename}"
            
            return {
                "pdf_url": public_url,
                "output": f"Successfully generated PDF: {title}. View at: {public_url} ",
                "filename": filename
            }
            
        except Exception as e:
            print(f"❌ PDF Error: {str(e)}")
            return {
                "error": str(e),
                "output": f"Failed to generate PDF: {str(e)}"
            }
