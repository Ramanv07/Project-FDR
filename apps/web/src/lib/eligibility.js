/**
 * Release eligibility rules.
 * Each condition is either auto-checked from FDR data or requires manual confirmation.
 * The release button stays disabled until all required items pass.
 */

import { daysUntil } from './format';

const ELIGIBILITY_RULES = [
  {
    id: 'approval_period',
    label: 'Approval period completed',
    required: true,
    autoCheck: (fdr) => {
      if (!fdr.approvalEndDate) return false;
      return daysUntil(fdr.approvalEndDate) <= 0;
    },
  },
  {
    id: 'no_compliance_issue',
    label: 'No pending compliance issue',
    required: true,
    autoCheck: (fdr) => !fdr.hasComplianceIssue,
  },
  {
    id: 'valid_original',
    label: 'Valid original FDR on record',
    required: true,
    autoCheck: (fdr) => fdr.documents && fdr.documents.length > 0,
  },
  {
    id: 'bank_confirmed',
    label: 'FDR verified by bank',
    required: true,
    autoCheck: (fdr) => fdr.trustLevel === 'bank_confirmed',
  },
  {
    id: 'no_duplicate',
    label: 'No duplicate FDR number',
    required: true,
    autoCheck: (fdr) => !fdr.isDuplicate,
  },
  {
    id: 'matured_or_active',
    label: 'FDR matured or currently active',
    required: true,
    autoCheck: (fdr) => {
      const days = daysUntil(fdr.maturityDate);
      return days <= 0 || fdr.status === 'active';
    },
  },
];

/**
 * Evaluate all eligibility conditions for an FDR.
 * @returns {{ items: { id, label, required, passed }[], allRequiredMet: boolean }}
 */
export function checkEligibility(fdr) {
  const items = ELIGIBILITY_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    required: rule.required,
    passed: rule.autoCheck(fdr),
  }));

  const allRequiredMet = items.filter((i) => i.required).every((i) => i.passed);

  return { items, allRequiredMet };
}
