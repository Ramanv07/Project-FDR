-- FDR Trust Ledger PostgreSQL Schema
-- AICTE Institutional Security Deposit Portal

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Institutions Directory
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  aicte_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. User Accounts & Portal Operators
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('institution', 'officer', 'admin')),
  institution_id TEXT REFERENCES institutions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_institution_id ON users(institution_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));

-- 3. Pledged Fixed Deposit Receipts (FDRs)
CREATE TABLE IF NOT EXISTS fdrs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  fdr_number TEXT NOT NULL,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  bank TEXT NOT NULL,
  branch TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  bank_amount NUMERIC(14,2),
  issue_date DATE NOT NULL,
  maturity_date DATE NOT NULL,
  lien_holder TEXT NOT NULL DEFAULT 'Member Secretary, AICTE New Delhi',
  program_year TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  trust_level TEXT NOT NULL DEFAULT 'submitted',
  is_duplicate BOOLEAN NOT NULL DEFAULT false,
  has_compliance_issue BOOLEAN NOT NULL DEFAULT false,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  ocr_data JSONB,
  bank_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_dates CHECK (maturity_date > issue_date)
);
CREATE INDEX IF NOT EXISTS idx_fdrs_institution_id ON fdrs(institution_id);
CREATE INDEX IF NOT EXISTS idx_fdrs_fdr_number ON fdrs(fdr_number);
CREATE INDEX IF NOT EXISTS idx_fdrs_status ON fdrs(status);
CREATE INDEX IF NOT EXISTS idx_fdrs_maturity_date ON fdrs(maturity_date);

-- 4. Release Requests (3-Tier Statutory Authorization Chain)
CREATE TABLE IF NOT EXISTS release_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  fdr_id TEXT NOT NULL REFERENCES fdrs(id) ON DELETE CASCADE,
  fdr_number TEXT NOT NULL,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  current_step TEXT DEFAULT 'officer',
  approvals JSONB NOT NULL DEFAULT '[]'::jsonb,
  requested_by TEXT NOT NULL,
  requested_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_release_fdr_id ON release_requests(fdr_id);
CREATE INDEX IF NOT EXISTS idx_release_institution_id ON release_requests(institution_id);

-- 5. Cryptographic SHA-256 Chained Audit Ledger
CREATE TABLE IF NOT EXISTS audit_ledger (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id TEXT NOT NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  record_id TEXT,
  details TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  previous_hash TEXT NOT NULL,
  hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_ledger(timestamp);
