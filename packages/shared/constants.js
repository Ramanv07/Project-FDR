/**
 * Single source of truth for roles, statuses, trust levels and route paths.
 * Imported by both apps/web and apps/api so the two can never disagree.
 */

export const ROLES = {
  INSTITUTION: 'institution',
  OFFICER: 'officer',
  ADMIN: 'admin',
};

export const FDR_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  AI_CHECKED: 'ai_checked',
  BANK_REQUESTED: 'bank_requested',
  BANK_CONFIRMED: 'bank_confirmed',
  VERIFIED: 'verified',
  ACTIVE: 'active',
  EXPIRING: 'expiring',
  MATURED: 'matured',
  RENEWED: 'renewed',
  RELEASED: 'released',
  FLAGGED: 'flagged',
};

export const TRUST_LEVELS = {
  SUBMITTED: { key: 'submitted', label: 'T0: Self-Declared', step: 1, tier: 'T0' },
  AI_CHECKED: { key: 'ai_checked', label: 'T1: Document-Checked', step: 2, tier: 'T1' },
  OFFICER_REVIEWED: { key: 'officer_reviewed', label: 'T2a: Officer-Reviewed', step: 3, tier: 'T2' },
  BANK_CONFIRMED: { key: 'bank_confirmed', label: 'T2b: Bank-Confirmed', step: 4, tier: 'T2' },
  API_VERIFIED: { key: 'api_verified', label: 'T3: Core-API / NeSL Verified', step: 5, tier: 'T3' },
};

export const TIERS = {
  T0: { code: 'T0', title: 'Self-Declared', desc: 'Institution uploaded, pending scrutiny' },
  T1: { code: 'T1', title: 'Document-Checked', desc: 'AI OCR verified dates, amount & lien clause' },
  T2: { code: 'T2', title: 'Bank-Confirmed', desc: 'Officer scrutiny & signed bank confirmation' },
  T3: { code: 'T3', title: 'API-Verified', desc: 'Real-time Core Banking API or NeSL confirmation' },
};

export const RELEASE_STATUS = {
  PENDING: 'pending',
  OFFICER_APPROVED: 'officer_approved',
  SECTION_HEAD_APPROVED: 'section_head_approved',
  COMPETENT_AUTHORITY_APPROVED: 'competent_authority_approved',
  RELEASED: 'released',
  REJECTED: 'rejected',
};

export const APPROVAL_CHAIN = [
  { key: 'officer', label: 'Officer' },
  { key: 'section_head', label: 'Section Head' },
  { key: 'competent_authority', label: 'Competent Authority' },
];

export const BANK_RESPONSE_TYPE = {
  CONFIRMED: 'confirmed',
  MISMATCH: 'mismatch',
  NOT_FOUND: 'not_found',
};

export const HEALTH_SCORE_THRESHOLDS = {
  GOOD: 70,
  WARNING: 40,
};

export const ALERT_REMINDER_DAYS = [60, 30, 15, 7];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',

  // Institution
  INSTITUTION_DASHBOARD: '/institution/dashboard',
  SUBMIT_FDR: '/institution/fdr/submit',
  MY_FDRS: '/institution/fdrs',
  FDR_DETAIL: '/institution/fdr/:id',
  RENEW_FDR: '/institution/fdr/:id/renew',
  RELEASE_REQUEST: '/institution/fdr/:id/release',

  // Officer
  OFFICER_DASHBOARD: '/officer/dashboard',
  FDR_REGISTER: '/officer/fdr-register',
  INSTITUTION_LIST: '/officer/institutions',
  INSTITUTION_DETAIL: '/officer/institution/:id',
  RISK_QUEUE: '/officer/risk-queue',
  VERIFICATION_QUEUE: '/officer/verification-queue',
  FDR_REVIEW: '/officer/fdr/:id/review',
  COVERAGE_GAP: '/officer/coverage-gaps',
  RELEASE_APPROVALS: '/officer/release-approvals',
  REPORTS: '/officer/reports',

  // Admin
  USER_MANAGEMENT: '/admin/users',
  ALERT_SETTINGS: '/admin/alerts',
  AUDIT_LEDGER: '/admin/audit',

  // Mock bank
  MOCK_BANK: '/mock-bank',
};

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

export const BANKS = [
  'State Bank of India',
  'Bank of Baroda',
  'Canara Bank',
  'HDFC Bank',
  'Punjab National Bank',
  'Union Bank of India',
  'Indian Overseas Bank',
  'Bank of India',
];
