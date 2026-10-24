/**
 * Health score calculation: rates an FDR from 0-100 based on risk factors.
 * Each factor deducts points and adds a human-readable reason.
 * Used in the risk queue and officer dashboard.
 */

import { FDR_STATUS, TRUST_LEVELS } from '@shared/constants';
import { daysUntil } from './format';

const RULES = [
  {
    id: 'unverified',
    deduction: 25,
    test: (fdr) => !fdr.trustLevel || fdr.trustLevel === TRUST_LEVELS.SUBMITTED.key,
    reason: 'Unverified by bank or officer',
  },
  {
    id: 'ai_only',
    deduction: 15,
    test: (fdr) => fdr.trustLevel === TRUST_LEVELS.AI_CHECKED.key,
    reason: 'Only AI-checked, pending officer review',
  },
  {
    id: 'maturing_soon',
    deduction: 20,
    test: (fdr) => {
      const days = daysUntil(fdr.maturityDate);
      return days >= 0 && days <= 30;
    },
    reason: (fdr) => `Matures in ${daysUntil(fdr.maturityDate)} days`,
  },
  {
    id: 'already_matured',
    deduction: 30,
    test: (fdr) => daysUntil(fdr.maturityDate) < 0,
    reason: 'FDR has already matured',
  },
  {
    id: 'amount_mismatch',
    deduction: 20,
    test: (fdr) => fdr.bankAmount != null && fdr.bankAmount !== fdr.amount,
    reason: 'Amount mismatch between submitted and bank records',
  },
  {
    id: 'missing_document',
    deduction: 10,
    test: (fdr) => !fdr.documents || fdr.documents.length === 0,
    reason: 'No supporting document uploaded',
  },
  {
    id: 'flagged',
    deduction: 15,
    test: (fdr) => fdr.status === FDR_STATUS.FLAGGED,
    reason: 'Flagged for senior review',
  },
  {
    id: 'duplicate',
    deduction: 15,
    test: (fdr) => fdr.isDuplicate,
    reason: 'Duplicate FDR number detected',
  },
];

/**
 * @param {Object} fdr - an FDR record
 * @returns {{ score: number, reasons: string[] }}
 */
export function calculateHealthScore(fdr) {
  let score = 100;
  const reasons = [];

  for (const rule of RULES) {
    if (rule.test(fdr)) {
      score -= rule.deduction;
      const reasonText = typeof rule.reason === 'function' ? rule.reason(fdr) : rule.reason;
      reasons.push(reasonText);
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons,
  };
}
