# FDR Trust Ledger — System Architecture

## Architecture Overview

FDR Trust Ledger is designed as a secure, role-based compliance tracking system for institutional Fixed Deposit Receipts pledged in favour of the AICTE.

```mermaid
graph TD
    subgraph Frontend ["Frontend Web Application (React + Vite + Tailwind CSS)"]
        UI[UI Components & Layouts]
        Router[Role-Based Router & Guards]
        FeatureStore[Feature API & Domain Hooks]
        MockService[Mock Service Layer / apiClient]
    end

    subgraph LogicEngines ["Core Domain Logic Engines (Shared & Client Libs)"]
        HS[Health Score Engine 0-100]
        GD[Coverage Gap Detection Engine]
        HC[SHA-256 Hash Chain Integrity Engine]
        BS[HMAC Bank Signature Engine]
        EL[Release Eligibility Checker]
        FV[FDR Data Validator]
    end

    subgraph BackendAPI ["API Server (Node.js + Express)"]
        AuthMod[Auth & Role Governance]
        FDRMod[FDR Lifecycle & OCR Pipe]
        RiskMod[Risk Scrutiny & Gap Audit]
        ReleaseMod[3-Tier Approval Chain]
        AuditMod[Cryptographic Ledger]
        CronJobs[node-cron: Maturity & Escalations]
    end

    subgraph SimulatedBank ["Simulated Core Banking Service"]
        BankAPI[Core Banking Endpoints]
        KeyStore[Demo HMAC/RSA Keyring]
        BankDB[Bank Core Ledger]
    end

    subgraph DataStore ["Database Storage"]
        MongoDB[(MongoDB Document Store)]
    end

    UI --> FeatureStore
    FeatureStore --> LogicEngines
    FeatureStore --> MockService
    MockService -.->|In Production| BackendAPI
    BackendAPI --> MongoDB
    BackendAPI --> SimulatedBank
    CronJobs --> BackendAPI
```

## Core Architectural Guarantees

1. **Strict Separation of Concerns:**
   - **Pages** perform no direct HTTP requests; all operations flow through domain `api.js` modules.
   - **Controllers** maintain zero business logic; execution delegates to dedicated domain services.
   - **Single Source of Truth:** Constants (`ROLES`, `FDR_STATUS`, `TRUST_LEVELS`, `ROUTES`) are centralized in `@fdr/shared` to eliminate state discrepancy.

2. **Immutable Audit Ledger:**
   - Every state transition generates a block: `H_n = SHA-256(H_{n-1} | timestamp | userId | action | recordId | payload)`.
   - Any retrospective tampering instantly invalidates all downstream hashes, making unauthorized alterations cryptographically detectable.

3. **Multi-Way Scrutiny Reconciliation:**
   - Three independent streams of truth (Institution Claim, OCR Extracted Text, Bank Cryptographic Response) are audited concurrently to catch deposit inflation or forged certificates.
