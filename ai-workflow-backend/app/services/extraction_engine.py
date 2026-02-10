import os
import json
import pandas as pd
import pdfplumber
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class ExtractionEngine:
    """Intelligent data extraction from multiple file formats."""
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """Extract text content based on file extension."""
        if not os.path.exists(file_path):
            return f"Error: File not found at {file_path}"
            
        ext = os.path.splitext(file_path)[1].lower()
        
        try:
            if ext == '.csv':
                return ExtractionEngine._extract_csv(file_path)
            elif ext in ['.xls', '.xlsx']:
                return ExtractionEngine._extract_excel(file_path)
            elif ext == '.pdf':
                return ExtractionEngine._extract_pdf(file_path)
            elif ext == '.json':
                return ExtractionEngine._extract_json(file_path)
            elif ext in ['.txt', '.md']:
                return ExtractionEngine._extract_plain_text(file_path)
            else:
                return f"Unsupported file format: {ext}"
        except Exception as e:
            logger.error(f"Extraction failed for {file_path}: {str(e)}")
            return f"Extraction Error: {str(e)}"

    @staticmethod
    def _extract_csv(file_path: str) -> str:
        df = pd.read_csv(file_path)
        try:
            return df.to_markdown(index=False)
        except Exception:
            # Fallback if tabulate is missing
            return df.to_string(index=False)

    @staticmethod
    def _extract_excel(file_path: str) -> str:
        # Read all sheets
        dict_df = pd.read_excel(file_path, sheet_name=None)
        output = []
        for sheet_name, df in dict_df.items():
            output.append(f"### Sheet: {sheet_name}\n")
            try:
                output.append(df.to_markdown(index=False))
            except Exception:
                output.append(df.to_string(index=False))
            output.append("\n")
        return "\n".join(output)

    @staticmethod
    def _extract_pdf(file_path: str) -> str:
        text_content = []
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text_content.append(f"--- Page {i+1} ---\n{page_text}")
                
                tables = page.extract_tables()
                if tables:
                    for table in tables:
                        df = pd.DataFrame(table[1:], columns=table[0])
                        try:
                            text_content.append(f"\nTable on Page {i+1}:\n{df.to_markdown(index=False)}")
                        except Exception:
                            text_content.append(f"\nTable on Page {i+1}:\n{df.to_string(index=False)}")
                        
        if not text_content:
            return "PDF is empty or contains only images/handwriting. (Switching to Multimodal analysis is recommended)."
            
        return "\n\n".join(text_content)

    @staticmethod
    def _extract_json(file_path: str) -> str:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return json.dumps(data, indent=2)

    @staticmethod
    def _extract_plain_text(file_path: str) -> str:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
