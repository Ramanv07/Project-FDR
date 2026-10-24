# FDR Trust Ledger

**Institutional Security Deposit & Fixed Deposit Receipt (FDR) Monitoring Portal**  
*All India Council for Technical Education (AICTE), New Delhi*

---

> [!IMPORTANT]
> **SIMULATED BANK DISCLAIMER:**  
> The core banking console and bank inquiry webhooks included in this repository are **simulated mock services intended strictly for demonstration and hackathon evaluation**. They do not interface with actual production banking systems or live bank accounts. Cryptographic signatures generated in the mock console are computed using local HMAC-SHA256 algorithms for demonstration of non-repudiation principles.

---

## Overview

Technical educational institutions approved by AICTE are statutorily required to maintain security deposits in the form of Fixed Deposit Receipts (FDRs) pledged with a lien marked in favour of the AICTE Member Secretary. 

**FDR Trust Ledger** solves the operational and regulatory risks of unverified deposits, forged certificates, deposit inflation, and silent coverage lapses.

### Key Capabilities
- **Three-Way Scrutiny Reconciliation:** Cross-references institution submissions against automated OCR document extractions and cryptographically signed bank API responses.
- **Dynamic Risk Health Scoring (0–100):** Rates every FDR on risk parameters (unverified statuses, approaching maturities, amount discrepancies, duplicate certificates).
- **Automated Coverage Gap Detection:** Evaluates validity periods across renewals and highlights uncovered statutory intervals with Gantt-style visual timelines.
- **Sequential 3-Tier Release Approvals:** Enforces mandatory checks (completed approval period, zero pending compliance inquiries, bank verification) through Scrutiny Officer, Section Head, and Competent Authority gates.
- **SHA-256 Chained Immutable Audit Ledger:** Every status change is chained cryptographically. Includes a live integrity verifier and tampering demonstrator.

---

## Project Structure (npm workspaces monorepo)

```
fdr-trust-ledger/
├── apps/
│   ├── web/                     # React + Vite + Tailwind CSS frontend
│   ├── api/                     # Node.js + Express backend service
│   └── mock-bank/               # Standalone simulated bank console
├── packages/
│   └── shared/                  # Single source of truth constants (roles, statuses)
├── docs/                        # Architecture, API specs, and judge demo script
└── docker-compose.yml           # Multi-container orchestration
```

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
From the root repository directory:
```bash
npm install
```

### Running the Development Environment

1. **Start the Web Frontend (Standalone with Mock Service Layer):**
   ```bash
   npm run dev
   ```
   Access the portal at `http://localhost:5173`.

2. **Start the Express API Backend:**
   ```bash
   npm run dev:api
   ```
   API runs on `http://localhost:3001`.

3. **Start the Simulated Bank Service:**
   ```bash
   npm run dev:bank
   ```
   Bank console API runs on `http://localhost:3002`.

4. **Run All Concurrently:**
   ```bash
   npm run dev:all
   ```

---

## Running Unit Tests

Run algorithm and cryptographic verification test suites:
```bash
npm run test
```
Tests cover:
- Health score deduction rules (`healthScore.test.js`)
- SHA-256 hash chaining and tamper detection (`hashChain.test.js`)
- Coverage gap lapse calculation (`gapDetection.test.js`)

---

## Judge Demonstration Script

Refer to [`docs/demo-script.md`](./docs/demo-script.md) for a click-by-click walkthrough demonstrating:
1. Fast role switching between Officer, Institution Staff, and Admin.
2. Detecting amount mismatches on FDR `#55219387640`.
3. Uncovering the 15-day regulatory gap at MANIT Bhopal.
4. Auto-filling new FDRs via simulated OCR.
5. Approving release requests through the 3-tier chain.
6. Cryptographic integrity checking with live tampering simulation.
