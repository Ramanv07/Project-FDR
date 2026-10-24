/**
 * FDR validation checks: duplicate detection, date logic, amount mismatches.
 * Runs on the submitted FDR data and returns a list of issues.
 */

import { daysBetween } from './format';

/**
 * Check a single FDR for data quality issues.
 * @param {Object} fdr - the FDR to validate
 * @param {Object[]} allFdrs - all FDRs in the system (for duplicate check)
 * @returns {{ valid: boolean, errors: { field: string, message: string }[] }}
 */
export function validateFdr(fdr, allFdrs = []) {
  const errors = [];

  // Date logic
  if (fdr.issueDate && fdr.maturityDate) {
    if (daysBetween(fdr.issueDate, fdr.maturityDate) <= 0) {
      errors.push({
        field: 'maturityDate',
        message: 'Maturity date must be after issue date',
      });
    }
  }

  // Amount range check
  if (fdr.amount != null) {
    const amt = Number(fdr.amount);
    if (isNaN(amt) || amt <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be a positive number' });
    }
  }

  // FDR number format (basic: must be numeric, 8+ digits)
  if (fdr.fdrNumber) {
    if (!/^\d{8,}$/.test(fdr.fdrNumber)) {
      errors.push({ field: 'fdrNumber', message: 'FDR number must be at least 8 digits' });
    }
  }

  // Duplicate FDR number across institutions
  if (fdr.fdrNumber && allFdrs.length > 0) {
    const dupes = allFdrs.filter(
      (f) => f.fdrNumber === fdr.fdrNumber && f.id !== fdr.id,
    );
    if (dupes.length > 0) {
      const instNames = dupes.map((d) => d.institutionName || d.institutionId).join(', ');
      errors.push({
        field: 'fdrNumber',
        message: `Duplicate FDR number also found at: ${instNames}`,
      });
    }
  }

  // Amount mismatch with bank
  if (fdr.bankAmount != null && fdr.amount != null) {
    if (Number(fdr.bankAmount) !== Number(fdr.amount)) {
      errors.push({
        field: 'amount',
        message: `Amount mismatch: submitted Rs ${fdr.amount}, bank reports Rs ${fdr.bankAmount}`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Scan all FDRs and flag duplicates.
 * @returns {Map<string, string[]>} fdrNumber -> list of institution IDs that have it
 */
export function findDuplicates(fdrs) {
  const byNumber = new Map();
  for (const fdr of fdrs) {
    if (!fdr.fdrNumber) continue;
    if (!byNumber.has(fdr.fdrNumber)) {
      byNumber.set(fdr.fdrNumber, []);
    }
    byNumber.get(fdr.fdrNumber).push(fdr.institutionId);
  }

  // Only return entries with more than one institution
  const dupes = new Map();
  for (const [num, insts] of byNumber) {
    if (insts.length > 1) {
      dupes.set(num, insts);
    }
  }
  return dupes;
}
