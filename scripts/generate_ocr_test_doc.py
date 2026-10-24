import os
import sys

# Import our FDRCanvas generator
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from generate_fdr_samples import FDRCanvas

def generate_ocr_test_doc(filepath):
    c = FDRCanvas()
    # High-contrast border for OCR edge detection
    c.rect(20, 20, 555, 802, stroke=True, stroke_color=(0, 0, 0), width=3)
    c.rect(25, 25, 545, 792, stroke=True, stroke_color=(0.3, 0.3, 0.3), width=1)

    # Header
    c.rect(30, 735, 535, 75, fill=True, fill_color=(0.94, 0.96, 0.98), stroke=True, stroke_color=(0, 0, 0), width=1.5)
    c.text("CANARA BANK", 45, 785, font="F2", size=24, color=(0, 0.2, 0.5))
    c.text("SPECIAL AICTE FIXED DEPOSIT RECEIPT - OCR BENCHMARK DOCUMENT", 45, 765, font="F2", size=10, color=(0.1, 0.1, 0.1))
    c.text("Branch: Connaught Place, New Delhi - 110001 | IFSC: CNRB0000123", 45, 748, font="F1", size=9, color=(0.3, 0.3, 0.3))

    # Test Banner
    c.rect(40, 695, 515, 28, fill=True, fill_color=(1.0, 0.95, 0.8), stroke=True, stroke_color=(0.8, 0.5, 0.0), width=1.5)
    c.text("OCR BENCHMARK TEST SPECIMEN - AICTE TRUST LEDGER VERIFICATION", 70, 705, font="F2", size=10, color=(0.6, 0.3, 0.0))

    # Data Table Box
    c.rect(40, 440, 515, 235, stroke=True, stroke_color=(0, 0, 0), width=1.5)
    c.rect(40, 645, 515, 30, fill=True, fill_color=(0.2, 0.2, 0.2), stroke=False)
    c.text("MACHINE READABLE OCR FIELDS", 195, 656, font="F2", size=11, color=(1, 1, 1))

    # Field rows with crisp black text
    fields = [
        ("Issuing Bank", "Canara Bank", 615),
        ("FDR Certificate No", "CNRB-FDR-88392014", 585),
        ("Account / CIF No", "501928471029", 555),
        ("Principal Amount", "INR 12,00,000.00 (Rupees Twelve Lakhs Only)", 525),
        ("Date of Issue", "01-Aug-2024", 495),
        ("Date of Maturity", "01-Aug-2027", 465),
    ]

    for label, val, y in fields:
        c.text(f"{label}:", 55, y, font="F2", size=11, color=(0, 0, 0))
        c.text(val, 220, y, font="F3", size=11, color=(0, 0, 0))
        c.line(40, y - 8, 555, y - 8, width=0.5, stroke_color=(0.8, 0.8, 0.8))

    # Mandatory AICTE Lien Section
    c.rect(40, 310, 515, 110, fill=True, fill_color=(0.95, 0.98, 0.95), stroke=True, stroke_color=(0.1, 0.5, 0.1), width=1.5)
    c.text("MANDATORY REGULATORY LIEN CLAUSE", 55, 395, font="F2", size=11, color=(0.1, 0.5, 0.1))
    c.line(55, 388, 535, 388, width=1, stroke_color=(0.1, 0.5, 0.1))

    c.text("LIEN HOLDER: MEMBER SECRETARY, AICTE, NEW DELHI", 55, 368, font="F2", size=12, color=(0.1, 0.45, 0.1))
    c.text("Legal Endorsement: Pledged unconditionally as Institutional Security Deposit in joint name.", 55, 348, font="F1", size=9, color=(0.2, 0.2, 0.2))
    c.text("Notice to Banker: No release, liquidation, or loan permissible without AICTE discharge certificate.", 55, 332, font="F1", size=9, color=(0.2, 0.2, 0.2))

    # Signatures
    c.rect(40, 190, 515, 100, stroke=True, stroke_color=(0.5, 0.5, 0.5), width=1)
    c.text("OFFICIAL STAMP & VERIFICATION EMBLEM", 160, 268, font="F2", size=9, color=(0.4, 0.4, 0.4))
    
    c.rect(60, 205, 110, 55, stroke=True, stroke_color=(0, 0, 0), width=1)
    c.text("* CANARA BANK *", 75, 240, font="F2", size=8)
    c.text("CONNAUGHT PLACE", 72, 225, font="F2", size=7.5)
    c.text("SEAL VERIFIED", 80, 212, font="F1", size=7)

    c.text("Sd/- Authorized Signatory", 240, 235, font="F2", size=9)
    c.text("Canara Bank CP Branch", 240, 220, font="F1", size=8, color=(0.3, 0.3, 0.3))

    c.text("Sd/- Chief Manager", 430, 235, font="F2", size=9)
    c.text("Scale IV Officer #38910", 430, 220, font="F1", size=8, color=(0.3, 0.3, 0.3))

    # Machine-readable footer barcode line
    c.rect(40, 110, 515, 60, fill=True, fill_color=(0.95, 0.95, 0.95), stroke=True, stroke_color=(0.3, 0.3, 0.3))
    c.text("OCR TEST TARGET: EXPECTED VERDICT = VALID (100% COMPLIANT)", 55, 148, font="F2", size=10, color=(0.1, 0.5, 0.1))
    c.text("Verification Hash: 88392014-CNRB-DELHI-AICTE-12LAKH-01AUG2027", 55, 128, font="F3", size=8.5, color=(0.3, 0.3, 0.3))

    c.save(filepath)

if __name__ == "__main__":
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "mock_fdrs"))
    generate_ocr_test_doc(os.path.join(out_dir, "FDR_OCR_TEST_DOCUMENT.pdf"))
    
    web_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "web", "public", "mock_fdrs"))
    generate_ocr_test_doc(os.path.join(web_dir, "FDR_OCR_TEST_DOCUMENT.pdf"))
