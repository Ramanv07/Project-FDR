import os

class SimplePDF:
    def __init__(self):
        self.objects = []
        self.stream_lines = []

    def add_line(self, x1, y1, x2, y2, width=1, r=0, g=0, b=0):
        self.stream_lines.append(f"{r:.2f} {g:.2f} {b:.2f} RG {width} w {x1} {y1} m {x2} {y2} l S")

    def add_rect(self, x, y, w, h, fill=False, stroke=True, fill_color=(1,1,1), stroke_color=(0,0,0), width=1):
        cmds = []
        if fill:
            cmds.append(f"{fill_color[0]:.2f} {fill_color[1]:.2f} {fill_color[2]:.2f} rg")
        if stroke:
            cmds.append(f"{stroke_color[0]:.2f} {stroke_color[1]:.2f} {stroke_color[2]:.2f} RG {width} w")
        op = "B" if fill and stroke else ("f" if fill else "S")
        cmds.append(f"{x} {y} {w} {h} re {op}")
        self.stream_lines.append(" ".join(cmds))

    def add_text(self, text, x, y, font="F1", size=11, r=0, g=0, b=0):
        # Escape parenthesis
        clean = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        self.stream_lines.append(f"BT /{font} {size} Tf {r:.2f} {g:.2f} {b:.2f} rg {x} {y} Td ({clean}) Tj ET")

    def build(self, filepath):
        content = "\n".join(self.stream_lines)
        content_bytes = content.encode("latin-1")
        
        # 1: Catalog, 2: Pages, 3: Page, 4: Content, 5: F1 (Helvetica), 6: F2 (Helvetica-Bold)
        objects = []
        
        objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
        objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
        objects.append(
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
            b"/Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>"
        )
        objects.append(
            f"<< /Length {len(content_bytes)} >>\nstream\n".encode("latin-1") +
            content_bytes +
            b"\nendstream"
        )
        objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
        objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

        # Assemble PDF
        out = [b"%PDF-1.4\n"]
        xref_offsets = []
        offset = len(out[0])
        
        for i, obj in enumerate(objects, 1):
            xref_offsets.append(offset)
            chunk = f"{i} 0 obj\n".encode("latin-1") + obj + b"\nendobj\n"
            out.append(chunk)
            offset += len(chunk)
            
        xref_pos = offset
        xref = [f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode("latin-1")]
        for off in xref_offsets:
            xref.append(f"{off:010d} 00000 n \n".encode("latin-1"))
            
        trailer = (
            f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
            f"startxref\n{xref_pos}\n%%EOF\n"
        ).encode("latin-1")
        
        full_pdf = b"".join(out) + b"".join(xref) + trailer
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "wb") as f:
            f.write(full_pdf)
        print(f"Generated PDF: {filepath} ({len(full_pdf)} bytes)")

# Test builder
pdf = SimplePDF()
pdf.add_text("TEST PDF", 50, 800, font="F2", size=18)
pdf.build("mock_fdrs/test.pdf")
