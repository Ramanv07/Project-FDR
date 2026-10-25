#!/usr/bin/env python3
"""
Real Neural PaddleOCR Engine for AICTE FDR Trust Ledger
Uses deep learning neural networks (PP-OCRv4) to scan documents,
detect text bounding boxes, recognize text, and validate against AICTE rules.
"""

import os
import sys
import json
import argparse
import logging

# Disable unnecessary verbose checks
os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"
os.environ["FLAGS_allocator_strategy"] = "auto_growth"
os.environ["FLAGS_enable_pir_api"] = "0"
os.environ["FLAGS_use_mkldnn"] = "0"
os.environ["FLAGS_use_onednn"] = "0"
logging.getLogger("ppocr").setLevel(logging.ERROR)

from paddleocr import PaddleOCR

def run_real_paddleocr(file_path):
    print("=" * 65)
    print("  AICTE FDR LEDGER - NEURAL PADDLEOCR ENGINE (PP-OCRv4)")
    print("=" * 65)
    print(f"Target Document: {file_path}")
    print("Loading Neural Detection & Recognition Models...")

    # Initialize PP-OCR model
    ocr = PaddleOCR(lang="en")
    
    print("Scanning document pixels with Convolutional Neural Network...")
    results = list(ocr.predict(file_path))

    extracted_lines = []
    print("\n[DETECTED TEXT BOUNDING BOXES & CONFIDENCE]:")
    
    for item in results:
        if isinstance(item, dict):
            texts = item.get('rec_texts', item.get('rec_text', []))
            scores = item.get('rec_scores', item.get('rec_score', []))
            if isinstance(texts, str):
                texts = [texts]
            if isinstance(scores, (int, float)):
                scores = [scores]
            for idx, text in enumerate(texts):
                score = scores[idx] if idx < len(scores) else 0.95
                extracted_lines.append(text)
                print(f"  [Score: {score:.2f}] {text}")
        elif isinstance(item, list):
            for line in item:
                if len(line) >= 2 and isinstance(line[1], (tuple, list)):
                    text, score = line[1][0], line[1][1]
                    extracted_lines.append(text)
                    print(f"  [Score: {score:.2f}] {text}")

    full_text = "\n".join(extracted_lines)

    # Scrutiny Parsing Heuristics
    detected_bank = "Unknown Bank"
    for b in ["Canara Bank", "State Bank of India", "Punjab National Bank", "Bank of Baroda", "HDFC Bank", "ICICI Bank"]:
        if b.lower() in full_text.lower():
            detected_bank = b
            break

    import re
    fdr_match = re.search(r'(?:FDR Certificate No|FDR No|Receipt No|Certificate No)[:\s\n]*([A-Z0-9-]{8,24})', full_text, re.IGNORECASE)
    fdr_num = fdr_match.group(1).strip() if fdr_match else "UNKNOWN-FDR"

    amt_match = re.search(r'(?:Principal Amount|Amount|INR|Rs\.?)[:\s\n]*([0-9,]+(?:\.\d{2})?)', full_text, re.IGNORECASE)
    amt_val = float(amt_match.group(1).replace(',', '')) if amt_match else 0.0

    has_aicte_lien = "MEMBER SECRETARY" in full_text.upper() and "AICTE" in full_text.upper()
    is_self_lien = "SELF" in full_text.upper() or "TRUSTEES" in full_text.upper()

    print("\n" + "-" * 65)
    print("[EXTRACTED METADATA FROM NEURAL OCR]:")
    print(f"  Bank Name   : {detected_bank}")
    print(f"  FDR Number  : {fdr_num}")
    print(f"  Amount      : Rs. {amt_val:,.2f}")
    print(f"  AICTE Lien  : {'VERIFIED PLEDGED' if has_aicte_lien and not is_self_lien else 'DEFECTIVE / SELF'}")

    is_compliant = amt_val >= 1000000 and has_aicte_lien and not is_self_lien
    print(f"  AICTE Status: {'VALID (APPROVED)' if is_compliant else 'REJECTED (DEFECTIVE)'}")
    print("=" * 65)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", default="mock_fdrs/FDR_OCR_TEST_DOCUMENT.pdf")
    args = parser.parse_args()

    run_real_paddleocr(args.file)
