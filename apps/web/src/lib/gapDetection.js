/**
 * Coverage gap detection: finds periods when an institution has no valid FDR.
 * Compares validity ranges of all FDRs for a single institution.
 */

import { daysBetween } from './format';

/**
 * Sort FDRs by issue date and find uncovered periods between them.
 * @param {Object[]} fdrs - FDR records for one institution, each with issueDate and maturityDate
 * @returns {{ gaps: { start: string, end: string, days: number }[], covered: { start: string, end: string, fdrNumber: string }[] }}
 */
export function detectCoverageGaps(fdrs) {
  if (!fdrs || fdrs.length === 0) {
    return { gaps: [], covered: [] };
  }

  // Sort by issue date ascending
  const sorted = [...fdrs]
    .filter((f) => f.issueDate && f.maturityDate)
    .sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));

  if (sorted.length === 0) {
    return { gaps: [], covered: [] };
  }

  const covered = sorted.map((fdr) => ({
    start: fdr.issueDate,
    end: fdr.maturityDate,
    fdrNumber: fdr.fdrNumber,
  }));

  const gaps = [];

  // Merge overlapping periods, then find the holes
  const merged = [];
  let current = { start: sorted[0].issueDate, end: sorted[0].maturityDate };

  for (let i = 1; i < sorted.length; i++) {
    const fdr = sorted[i];
    const fdrStart = new Date(fdr.issueDate);
    const currentEnd = new Date(current.end);

    if (fdrStart <= currentEnd) {
      // Overlapping or contiguous — extend the merged period
      if (new Date(fdr.maturityDate) > currentEnd) {
        current.end = fdr.maturityDate;
      }
    } else {
      merged.push({ ...current });
      current = { start: fdr.issueDate, end: fdr.maturityDate };
    }
  }
  merged.push({ ...current });

  // Gaps are the spaces between merged periods
  for (let i = 0; i < merged.length - 1; i++) {
    const gapStart = merged[i].end;
    const gapEnd = merged[i + 1].start;
    const days = daysBetween(gapStart, gapEnd);
    if (days > 0) {
      gaps.push({ start: gapStart, end: gapEnd, days });
    }
  }

  return { gaps, covered };
}
