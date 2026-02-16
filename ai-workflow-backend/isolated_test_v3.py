import asyncio
import os
import json
import logging
import traceback
from typing import Dict, Any, List

# Basic Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OCR Imports
try:
    import paddle
    from paddleocr import PaddleOCR
    from rapidfuzz import process, fuzz
    PADDLE_OK = True
except Exception as e:
    PADDLE_OK = False
    print("\n--- IMPORT ERROR ---")
    traceback.print_exc()

def extract_with_fuzzy(text_blocks: List[str], target_keys: Dict[str, List[str]]) -> Dict[str, Any]:
    extracted = {}
    for key, aliases in target_keys.items():
        best_match = None
        highest_score = 0
        for block in text_blocks:
            match = process.extractOne(block, aliases, scorer=fuzz.partial_ratio)
            if match and match[1] > 80:
                if match[1] > highest_score:
                    highest_score = match[1]
                    best_match = block
        if best_match:
            parts = best_match.split(":")
            if len(parts) > 1 and parts[1].strip():
                extracted[key] = parts[1].strip()
            else:
                idx = text_blocks.index(best_match)
                if idx + 1 < len(text_blocks):
                    extracted[key] = text_blocks[idx + 1].strip()
    return extracted

async def run_test():
    file_path = r"c:\Users\Admin\Agemt-chatbot\Agemt-chatbot\Vehicle_Insurance_Certificate_in_India.pdf"
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    # Set environment variables to avoid oneDNN errors on Windows
    os.environ['FLAGS_enable_mkldnn'] = '0'
    os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'
    
    print(f"\n--- Processing: {os.path.basename(file_path)} ---")
    
    try:
        # Initialize OCR with minimal config
        ocr = PaddleOCR(lang='en', use_angle_cls=True, show_log=False)
        
        # Run OCR
        result = ocr.ocr(file_path)
        
        extracted_text = []
        if result:
            for page in result:
                if page:
                    for line in page:
                        extracted_text.append(line[1][0])

        # Keys to find
        keys = {
            "policy_number": ["Policy Number", "Policy No", "Certificate No", "Policy/Certificate No"],
            "registration_number": ["Registration Number", "Reg No", "Regn No", "Vehicle Regn. No"],
            "insured_name": ["Insured Name", "Name of Insured", "Name"],
            "valid_to": ["To", "Valid Up to", "Expiry", "Period of Insurance"]
        }

        # Extract
        data = extract_with_fuzzy(extracted_text, keys)
        
        print("\n" + "="*40)
        print("       EXTRACTED DATA (JSON)")
        print("="*40)
        print(json.dumps(data, indent=2))
        print("\n--- Raw OCR Lines (First 15) ---")
        for line in extracted_text[:15]:
            print(f"- {line}")
            
    except Exception as e:
        print("\n--- RUNTIME ERROR ---")
        traceback.print_exc()

if __name__ == "__main__":
    if PADDLE_OK:
        asyncio.run(run_test())
    else:
        print("\nDependency check failed. Stopping.")
