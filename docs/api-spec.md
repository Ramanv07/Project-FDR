# FDR Trust Ledger — API Specification

Base URL: `http://localhost:3001/api`

## Authentication (`/api/auth`)
- `POST /login`: Authenticates an official or institution staff member. Returns JWT bearer token.
- `POST /register-institution`: Enrolls technical institute and creates primary administrator credentials.

## Fixed Deposit Receipts (`/api/fdrs`)
- `GET /`: Lists FDR records with filtering by institution, status, bank, and search keywords.
- `GET /:id`: Retrieves comprehensive FDR record including documents and audit history timeline.
- `POST /`: Submits a newly pledged FDR certificate into scrutiny custody.
- `POST /renew`: Registers replacement FDR and links it to preceding deposit record.

## Scrutiny & Risk Scans (`/api/risk` & `/api/verifications`)
- `GET /risk/queue`: Retrieves FDR records ranked in ascending order of health score (0-100).
- `GET /risk/coverage-gaps`: Computes coverage continuity intervals and detects uncovered lapses per institute.
- `GET /verifications/queue`: Returns pending bank checks and flagged discrepancies.
- `POST /verifications/action`: Records officer scrutiny determinations (Approve, Request Clarification, Flag).

## Deposit Release (`/api/release`)
- `GET /requests`: Lists pending refund and security deposit release applications.
- `POST /submit`: Validates regulatory checklist and lodges release application.
- `POST /approve-step`: Progresses 3-tier authorization chain (Officer -> Section Head -> Competent Authority).

## Cryptographic Audit Ledger (`/api/audit`)
- `GET /ledger`: Returns SHA-256 hash-chained immutable sequence of all ledger operations.
- `POST /verify`: Executes cryptographic verification traversal across all chain entries.
