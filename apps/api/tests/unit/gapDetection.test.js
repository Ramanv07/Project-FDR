import { describe, it, expect } from '@jest/globals';

function detectCoverageGaps(fdrs) {
  if (!fdrs || fdrs.length < 2) return [];
  const sorted = [...fdrs].sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));
  const gaps = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const prevEnd = new Date(sorted[i].maturityDate);
    const nextStart = new Date(sorted[i + 1].issueDate);
    const diffDays = Math.round((nextStart - prevEnd) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      gaps.push({ start: sorted[i].maturityDate, end: sorted[i + 1].issueDate, days: diffDays });
    }
  }
  return gaps;
}

describe('Coverage Gap Detection Algorithm', () => {
  it('identifies uncovered lapse between matured FDR and new replacement', () => {
    const fdrs = [
      { issueDate: '2023-01-01', maturityDate: '2025-03-10' },
      { issueDate: '2025-03-25', maturityDate: '2028-03-25' },
    ];

    const gaps = detectCoverageGaps(fdrs);
    expect(gaps.length).toBe(1);
    expect(gaps[0].days).toBe(15);
  });

  it('reports zero gaps when renewals overlap or coincide seamlessly', () => {
    const fdrs = [
      { issueDate: '2023-01-01', maturityDate: '2025-03-10' },
      { issueDate: '2025-03-10', maturityDate: '2028-03-10' },
    ];

    const gaps = detectCoverageGaps(fdrs);
    expect(gaps.length).toBe(0);
  });
});
