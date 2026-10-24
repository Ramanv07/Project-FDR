# Fixed Deposit Verification & Reconciliation Flow

This document outlines the four-step verification lifecycle of an FDR from initial submission to final regulatory custody.

```mermaid
sequenceDiagram
    autonumber
    participant Inst as Technical Institution
    participant Portal as AICTE Trust Portal
    participant OCR as Automated OCR Pipeline
    participant Bank as Core Banking System
    participant Officer as AICTE Scrutiny Officer
    participant Ledger as SHA-256 Audit Ledger

    Inst->>Portal: Upload scanned FDR certificate & details
    Portal->>OCR: Extract certificate text & bounding boxes
    OCR-->>Portal: Pre-filled metadata (FDR #, amount, dates)
    Inst->>Portal: Confirm fields & submit FDR
    Portal->>Ledger: Append entry: FDR_SUBMITTED (Hash chained)

    Portal->>Bank: Dispatch digital inquiry request
    Bank->>Bank: Verify deposit balance & lien endorsement
    Bank-->>Portal: Cryptographically signed response (Confirm / Mismatch)
    Portal->>Ledger: Append entry: BANK_RESPONSE_VERIFIED

    alt Discrepancy Found (Amount / Date Mismatch)
        Portal->>Officer: Flag in Verification & Risk Queue
        Officer->>Portal: Three-way reconciliation review
        Officer->>Inst: Request formal clarification or escalate
    else Details Concordant
        Officer->>Portal: Endorse scrutiny approval
        Portal->>Ledger: Advance Trust Level: Bank-confirmed & Active
    end
```

## Scrutiny Reconciliation Rules

1. **Amount Parity:** The claimed amount must equal the bank's signed affirmation. Any shortfall is flagged with deduction in health score.
2. **Lien Clause:** Endorsement must explicitly designate "Member Secretary, AICTE, New Delhi".
3. **Maturity Coverage:** Valid until or past the statutory programme approval tenure.
