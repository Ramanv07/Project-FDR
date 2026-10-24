import os

class FDRCanvas:
    def __init__(self, width=595, height=842): # A4
        self.width = width
        self.height = height
        self.stream = []

    def rect(self, x, y, w, h, fill=False, stroke=True, fill_color=(1,1,1), stroke_color=(0,0,0), width=1):
        cmds = []
        if fill:
            cmds.append(f"{fill_color[0]:.2f} {fill_color[1]:.2f} {fill_color[2]:.2f} rg")
        if stroke:
            cmds.append(f"{stroke_color[0]:.2f} {stroke_color[1]:.2f} {stroke_color[2]:.2f} RG {width} w")
        op = "B" if fill and stroke else ("f" if fill else "S")
        cmds.append(f"{x} {y} {w} {h} re {op}")
        self.stream.append(" ".join(cmds))

    def line(self, x1, y1, x2, y2, width=1, stroke_color=(0,0,0)):
        self.stream.append(f"{stroke_color[0]:.2f} {stroke_color[1]:.2f} {stroke_color[2]:.2f} RG {width} w {x1} {y1} m {x2} {y2} l S")

    def text(self, text, x, y, font="F1", size=10, color=(0,0,0)):
        clean = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        self.stream.append(f"BT /{font} {size} Tf {color[0]:.2f} {color[1]:.2f} {color[2]:.2f} rg {x} {y} Td ({clean}) Tj ET")

    def save(self, filepath):
        content = "\n".join(self.stream)
        content_bytes = content.encode("latin-1")
        
        objects = [
            b"<< /Type /Catalog /Pages 2 0 R >>",
            b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {self.width} {self.height}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>".encode("latin-1"),
            f"<< /Length {len(content_bytes)} >>\nstream\n".encode("latin-1") + content_bytes + b"\nendstream",
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>"
        ]

        out = [b"%PDF-1.4\n"]
        offsets = []
        offset = len(out[0])
        
        for i, obj in enumerate(objects, 1):
            offsets.append(offset)
            chunk = f"{i} 0 obj\n".encode("latin-1") + obj + b"\nendobj\n"
            out.append(chunk)
            offset += len(chunk)
            
        xref_pos = offset
        xref = [f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode("latin-1")]
        for off in offsets:
            xref.append(f"{off:010d} 00000 n \n".encode("latin-1"))
            
        trailer = (
            f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
            f"startxref\n{xref_pos}\n%%EOF\n"
        ).encode("latin-1")
        
        pdf_data = b"".join(out) + b"".join(xref) + trailer
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "wb") as f:
            f.write(pdf_data)
        print(f"Created: {filepath} ({len(pdf_data)} bytes)")


def generate_valid_fdr(filepath):
    c = FDRCanvas()
    # Outer formal borders
    c.rect(20, 20, 555, 802, stroke=True, stroke_color=(0.12, 0.23, 0.37), width=2.5) # Deep Navy border
    c.rect(26, 26, 543, 790, stroke=True, stroke_color=(0.7, 0.7, 0.7), width=0.8)

    # Top Bank Header banner
    c.rect(28, 730, 539, 84, fill=True, fill_color=(0.95, 0.97, 1.0), stroke=False)
    c.text("STATE BANK OF INDIA", 40, 785, font="F2", size=22, color=(0.12, 0.23, 0.37))
    c.text("Civil Lines Branch, Bhopal (M.P.) - 462001 | Branch Code: 01234", 40, 765, font="F1", size=10, color=(0.3, 0.3, 0.3))
    c.text("IFSC: SBIN0001234 | Tel: 0755-2554011 | Email: sbi.01234@sbi.co.in", 40, 750, font="F1", size=9, color=(0.4, 0.4, 0.4))
    c.line(28, 730, 567, 730, width=1.5, stroke_color=(0.12, 0.23, 0.37))

    # Certificate Title
    c.rect(130, 698, 335, 24, fill=True, stroke=True, fill_color=(0.12, 0.23, 0.37), stroke_color=(0.12, 0.23, 0.37))
    c.text("FIXED DEPOSIT RECEIPT (SPECIAL TERM DEPOSIT)", 140, 706, font="F2", size=11, color=(1, 1, 1))

    # AICTE Regulatory Notice Pill
    c.rect(40, 665, 515, 22, fill=True, stroke=True, fill_color=(0.93, 0.96, 0.93), stroke_color=(0.2, 0.5, 0.2), width=1)
    c.text("SECURITY DEPOSIT LODGED UNDER AICTE APPROVAL PROCESS HANDBOOK NORMS", 55, 672, font="F2", size=9, color=(0.1, 0.45, 0.1))

    # Details Box 1: Receipt Reference
    c.rect(40, 580, 515, 75, stroke=True, stroke_color=(0.8, 0.8, 0.8), width=1)
    c.text("FDR Certificate No:", 50, 638, font="F2", size=10, color=(0.2, 0.2, 0.2))
    c.text("SBI-FDR-98421035", 170, 638, font="F3", size=11, color=(0.12, 0.23, 0.37))

    c.text("Account / CIF No:", 340, 638, font="F2", size=10, color=(0.2, 0.2, 0.2))
    c.text("38947102954", 450, 638, font="F3", size=11, color=(0.12, 0.23, 0.37))

    c.text("Depositor / Institution:", 50, 615, font="F2", size=10, color=(0.2, 0.2, 0.2))
    c.text("MAULANA AZAD NATIONAL INSTITUTE OF TECHNOLOGY (MANIT)", 170, 615, font="F2", size=9, color=(0, 0, 0))

    c.text("AICTE Institution ID:", 50, 595, font="F2", size=10, color=(0.2, 0.2, 0.2))
    c.text("1-3647189101 (Central Region - Madhya Pradesh)", 170, 595, font="F1", size=9, color=(0.3, 0.3, 0.3))

    # Financial Information Table Box
    c.rect(40, 430, 515, 140, stroke=True, stroke_color=(0.8, 0.8, 0.8), width=1)
    c.rect(40, 545, 515, 25, fill=True, fill_color=(0.95, 0.95, 0.95), stroke=True, stroke_color=(0.8, 0.8, 0.8))
    c.text("FINANCIAL PARTICULARS & DEPOSIT TENURE", 50, 553, font="F2", size=10, color=(0.12, 0.23, 0.37))

    c.text("Principal Amount:", 50, 525, font="F2", size=10)
    c.text("INR 15,00,000.00", 170, 525, font="F2", size=12, color=(0.05, 0.45, 0.15))
    c.text("(Rupees Fifteen Lakhs Only)", 320, 525, font="F1", size=10, color=(0.3, 0.3, 0.3))

    c.text("Date of Issue:", 50, 498, font="F2", size=10)
    c.text("15-May-2024", 170, 498, font="F3", size=11, color=(0, 0, 0))

    c.text("Date of Maturity:", 340, 498, font="F2", size=10)
    c.text("15-May-2027", 440, 498, font="F3", size=11, color=(0.05, 0.45, 0.15))

    c.text("Deposit Period:", 50, 472, font="F2", size=10)
    c.text("36 Months (3 Years Fixed)", 170, 472, font="F1", size=10)

    c.text("Interest Rate:", 340, 472, font="F2", size=10)
    c.text("7.10% p.a. Compounded Quarterly", 440, 472, font="F1", size=9)

    c.text("Maturity Value:", 50, 446, font="F2", size=10)
    c.text("INR 18,52,430.00", 170, 446, font="F2", size=10, color=(0.12, 0.23, 0.37))

    # MANDATORY AICTE LIEN CLAUSE BOX (CRITICAL FOR VALIDATION)
    c.rect(40, 315, 515, 105, fill=True, stroke=True, fill_color=(0.98, 0.99, 1.0), stroke_color=(0.12, 0.23, 0.37), width=1.5)
    c.text("MANDATORY LIEN / ENCUMBRANCE ENDORSEMENT", 50, 398, font="F2", size=10, color=(0.12, 0.23, 0.37))
    c.line(50, 392, 540, 392, width=0.8, stroke_color=(0.12, 0.23, 0.37))

    c.text("LIEN HOLDER:", 50, 375, font="F2", size=10, color=(0.8, 0.1, 0.1))
    c.text("MEMBER SECRETARY, AICTE, NEW DELHI", 160, 375, font="F2", size=11, color=(0.12, 0.23, 0.37))

    c.text("Condition: This Fixed Deposit Receipt is held in Joint Name / Pledged to Member Secretary, AICTE,", 50, 355, font="F1", size=8.5, color=(0.2, 0.2, 0.2))
    c.text("New Delhi as security deposit against approval. The bank undertakes NOT to encash, discharge,", 50, 342, font="F1", size=8.5, color=(0.2, 0.2, 0.2))
    c.text("liquidate, or grant any credit/loan against this deposit without prior written clearance from AICTE.", 50, 329, font="F1", size=8.5, color=(0.2, 0.2, 0.2))

    # Verification Seal & Signatures
    c.rect(40, 205, 515, 95, stroke=True, stroke_color=(0.8, 0.8, 0.8), width=1)
    
    # Official Bank Seal stamp box
    c.rect(55, 215, 120, 75, stroke=True, stroke_color=(0.2, 0.3, 0.6), width=1)
    c.text("* STATE BANK OF INDIA *", 60, 268, font="F2", size=7, color=(0.2, 0.3, 0.6))
    c.text("CIVIL LINES BRANCH", 67, 253, font="F2", size=7.5, color=(0.2, 0.3, 0.6))
    c.text("BHOPAL - SEAL", 78, 238, font="F2", size=8, color=(0.2, 0.3, 0.6))
    c.text("VERIFIED & DISPATCHED", 62, 224, font="F1", size=6.5, color=(0.2, 0.3, 0.6))

    c.text("Sd/-", 240, 255, font="F1", size=9, color=(0.5, 0.5, 0.5))
    c.line(210, 245, 340, 245, width=1, stroke_color=(0.3, 0.3, 0.3))
    c.text("Authorized Officer (Emp #49201)", 210, 230, font="F2", size=8, color=(0.2, 0.2, 0.2))
    c.text("State Bank of India", 210, 218, font="F1", size=8, color=(0.4, 0.4, 0.4))

    c.text("Sd/-", 430, 255, font="F1", size=9, color=(0.5, 0.5, 0.5))
    c.line(400, 245, 530, 245, width=1, stroke_color=(0.3, 0.3, 0.3))
    c.text("Branch Manager / Chief Manager", 400, 230, font="F2", size=8, color=(0.2, 0.2, 0.2))
    c.text("Civil Lines Branch, Bhopal", 400, 218, font="F1", size=8, color=(0.4, 0.4, 0.4))

    # Bottom Audit & Machine-Readable OCR footer
    c.rect(40, 140, 515, 50, fill=True, fill_color=(0.96, 0.98, 0.96), stroke=True, stroke_color=(0.2, 0.6, 0.2))
    c.text("AICTE PORTAL COMPLIANCE STATUS: VALID & COMPLIANT", 50, 172, font="F2", size=10, color=(0.1, 0.5, 0.15))
    c.text("Meets 100% of AICTE criteria: Full INR 15 Lakh pledge | 36 Months Tenure | Valid Lien Marked", 50, 153, font="F1", size=8.5, color=(0.2, 0.4, 0.2))

    # Digital Signature / Hash Chain Tag
    c.text("OCR HASH: 7b3a9c02d184e951fa64821c38e91240a58140bc89230521e847c20948b3941a", 40, 115, font="F3", size=7, color=(0.4, 0.4, 0.4))
    c.text("AICTE FDR Trust Ledger Demo Asset - Compliant Sample Document", 40, 100, font="F1", size=8, color=(0.5, 0.5, 0.5))

    c.save(filepath)


def generate_rejected_fdr(filepath):
    c = FDRCanvas()
    # Outer formal borders (Crimson / Alert red theme)
    c.rect(20, 20, 555, 802, stroke=True, stroke_color=(0.7, 0.15, 0.15), width=2.5)
    c.rect(26, 26, 543, 790, stroke=True, stroke_color=(0.85, 0.7, 0.7), width=0.8)

    # Top Bank Header banner
    c.rect(28, 730, 539, 84, fill=True, fill_color=(1.0, 0.95, 0.95), stroke=False)
    c.text("PUNJAB NATIONAL BANK", 40, 785, font="F2", size=22, color=(0.65, 0.1, 0.1))
    c.text("Nehru Place Branch, New Delhi - 110019 | Branch Code: 024900", 40, 765, font="F1", size=10, color=(0.3, 0.3, 0.3))
    c.text("IFSC: PUNB0024900 | Tel: 011-26418900 | Email: bo2490@pnb.co.in", 40, 750, font="F1", size=9, color=(0.4, 0.4, 0.4))
    c.line(28, 730, 567, 730, width=1.5, stroke_color=(0.65, 0.1, 0.1))

    # Certificate Title
    c.rect(130, 698, 335, 24, fill=True, stroke=True, fill_color=(0.65, 0.1, 0.1), stroke_color=(0.65, 0.1, 0.1))
    c.text("FIXED DEPOSIT RECEIPT (TERM DEPOSIT)", 165, 706, font="F2", size=11, color=(1, 1, 1))

    # Defect Banner
    c.rect(40, 665, 515, 24, fill=True, stroke=True, fill_color=(0.95, 0.2, 0.2), stroke_color=(0.7, 0.1, 0.1), width=1)
    c.text("*** NON-COMPLIANT / SCRUTINY REJECTION SAMPLE ***", 135, 672, font="F2", size=10, color=(1, 1, 1))

    # Details Box 1: Receipt Reference
    c.rect(40, 580, 515, 75, stroke=True, stroke_color=(0.8, 0.8, 0.8), width=1)
    c.text("FDR Certificate No:", 50, 638, font="F2", size=10, color=(0.2, 0.2, 0.2))
    c.text("PNB-FDR-44021981", 170, 638, font="F3", size=11, color=(0.65, 0.1, 0.1))

    c.text("Account No:", 340, 638, font="F2", size=10, color=(0.2, 0.2, 0.2))
    c.text("024900DP001948", 450, 638, font="F3", size=11, color=(0.2, 0.2, 0.2))

    c.text("Depositor / Institution:", 50, 615, font="F2", size=10, color=(0.2, 0.2, 0.2))
    c.text("APEX INSTITUTE OF TECHNOLOGY & SCIENCE", 170, 615, font="F2", size=9, color=(0, 0, 0))

    c.text("AICTE Institution ID:", 50, 595, font="F2", size=10, color=(0.2, 0.2, 0.2))
    c.text("1-4920194820 (Northern Region - Delhi NCR)", 170, 595, font="F1", size=9, color=(0.3, 0.3, 0.3))

    # Financial Information Table Box
    c.rect(40, 430, 515, 140, stroke=True, stroke_color=(0.8, 0.8, 0.8), width=1)
    c.rect(40, 545, 515, 25, fill=True, fill_color=(0.98, 0.93, 0.93), stroke=True, stroke_color=(0.8, 0.8, 0.8))
    c.text("FINANCIAL PARTICULARS & DEPOSIT TENURE", 50, 553, font="F2", size=10, color=(0.65, 0.1, 0.1))

    # DEFECT 1: INSUFFICIENT AMOUNT
    c.text("Principal Amount:", 50, 525, font="F2", size=10)
    c.text("INR 5,00,000.00", 170, 525, font="F2", size=12, color=(0.8, 0.1, 0.1))
    c.text("[DEFICIT: Minimum Req: INR 15,00,000]", 305, 525, font="F2", size=9, color=(0.8, 0.1, 0.1))

    # DEFECT 2: EXPIRED DATES
    c.text("Date of Issue:", 50, 498, font="F2", size=10)
    c.text("10-Jan-2020", 170, 498, font="F3", size=11, color=(0, 0, 0))

    c.text("Date of Maturity:", 340, 498, font="F2", size=10)
    c.text("10-Jan-2023", 440, 498, font="F3", size=11, color=(0.8, 0.1, 0.1))

    c.text("Deposit Period:", 50, 472, font="F2", size=10)
    c.text("36 Months (EXPIRED)", 170, 472, font="F2", size=10, color=(0.8, 0.1, 0.1))

    c.text("Interest Rate:", 340, 472, font="F2", size=10)
    c.text("6.25% p.a.", 440, 472, font="F1", size=9)

    c.text("Maturity Status:", 50, 446, font="F2", size=10)
    c.text("MATURED & LAPSED ON 10-JAN-2023 (OVERDUE)", 170, 446, font="F2", size=10, color=(0.8, 0.1, 0.1))

    # DEFECT 3: DEFECTIVE LIEN ENDORSEMENT
    c.rect(40, 315, 515, 105, fill=True, stroke=True, fill_color=(1.0, 0.94, 0.94), stroke_color=(0.8, 0.2, 0.2), width=1.5)
    c.text("DEFECTIVE LIEN / ENCUMBRANCE RECORD", 50, 398, font="F2", size=10, color=(0.7, 0.1, 0.1))
    c.line(50, 392, 540, 392, width=0.8, stroke_color=(0.8, 0.2, 0.2))

    c.text("LIEN RECORDED:", 50, 375, font="F2", size=10, color=(0.8, 0.1, 0.1))
    c.text("SELF / OPERATED JOINTLY BY TRUSTEES (NO AICTE LIEN)", 160, 375, font="F2", size=10, color=(0.8, 0.1, 0.1))

    c.text("FATAL DEFECT: This deposit does NOT contain the mandatory lien mark in favor of", 50, 355, font="F1", size=8.5, color=(0.3, 0.1, 0.1))
    c.text("Member Secretary, AICTE New Delhi. The depositor retains unilateral withdrawal access.", 50, 342, font="F1", size=8.5, color=(0.3, 0.1, 0.1))
    c.text("Under Chapter II of AICTE Approval Handbook, this deposit cannot be accepted as security.", 50, 329, font="F1", size=8.5, color=(0.3, 0.1, 0.1))

    # Bank Stamp Box
    c.rect(40, 205, 515, 95, stroke=True, stroke_color=(0.8, 0.8, 0.8), width=1)
    c.rect(55, 215, 120, 75, stroke=True, stroke_color=(0.6, 0.2, 0.2), width=1)
    c.text("PUNJAB NATIONAL BANK", 62, 268, font="F2", size=7.5, color=(0.6, 0.2, 0.2))
    c.text("NEHRU PLACE - DELHI", 68, 253, font="F2", size=7.5, color=(0.6, 0.2, 0.2))
    c.text("** MATURED **", 80, 238, font="F2", size=9, color=(0.8, 0.1, 0.1))
    c.text("RECORDS ARCHIVED", 72, 224, font="F1", size=7, color=(0.5, 0.3, 0.3))

    c.text("Sd/-", 240, 255, font="F1", size=9, color=(0.5, 0.5, 0.5))
    c.line(210, 245, 340, 245, width=1, stroke_color=(0.3, 0.3, 0.3))
    c.text("Assistant General Manager", 210, 230, font="F2", size=8, color=(0.2, 0.2, 0.2))

    c.text("Sd/-", 430, 255, font="F1", size=9, color=(0.5, 0.5, 0.5))
    c.line(400, 245, 530, 245, width=1, stroke_color=(0.3, 0.3, 0.3))
    c.text("Senior Branch Manager", 400, 230, font="F2", size=8, color=(0.2, 0.2, 0.2))

    # Bottom AICTE Scrutiny Action Box
    c.rect(40, 125, 515, 65, fill=True, fill_color=(0.98, 0.90, 0.90), stroke=True, stroke_color=(0.8, 0.2, 0.2))
    c.text("AICTE PORTAL COMPLIANCE STATUS: REJECTED", 50, 172, font="F2", size=10, color=(0.8, 0.1, 0.1))
    c.text("1. Deficit of INR 10,00,000 (Submitted: 5 Lakh vs Required: 15 Lakh)", 50, 157, font="F1", size=8.5, color=(0.4, 0.1, 0.1))
    c.text("2. Expired validity: Deposit matured on 10-Jan-2023 (Overdue by >3 years)", 50, 144, font="F1", size=8.5, color=(0.4, 0.1, 0.1))
    c.text("3. Missing AICTE Lien endorsement; depositor can close account without AICTE approval", 50, 131, font="F1", size=8.5, color=(0.4, 0.1, 0.1))

    c.text("OCR HASH: e49a01f82b7c4091d83516a70e9b38421057df842091c53b2849102847c10294", 40, 105, font="F3", size=7, color=(0.5, 0.5, 0.5))
    c.text("AICTE FDR Trust Ledger Demo Asset - Defective Sample Document", 40, 92, font="F1", size=8, color=(0.5, 0.5, 0.5))

    c.save(filepath)

if __name__ == "__main__":
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "mock_fdrs"))
    generate_valid_fdr(os.path.join(out_dir, "FDR_VALID_SBI_15LAKH.pdf"))
    generate_rejected_fdr(os.path.join(out_dir, "FDR_REJECT_PNB_DEFECTIVE.pdf"))
    
    # Also copy to apps/web/public/mock_fdrs so users can preview/download in the browser!
    web_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "web", "public", "mock_fdrs"))
    generate_valid_fdr(os.path.join(web_dir, "FDR_VALID_SBI_15LAKH.pdf"))
    generate_rejected_fdr(os.path.join(web_dir, "FDR_REJECT_PNB_DEFECTIVE.pdf"))
