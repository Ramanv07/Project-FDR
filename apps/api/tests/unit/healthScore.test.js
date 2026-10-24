import { describe, it, expect } from '@jest/globals';

// Health score deduction rules mirror
function calculateHealthScore(fdr) {
  let score = 100;
  const reasons = [];

  if (!fdr.trustLevel || fdr.trustLevel === 'submitted') {
    score -= 25;
    reasons.push('Unverified by bank or officer');
  }
  if (fdr.trustLevel === 'ai_checked') {
    score -= 15;
    reasons.push('Only AI-checked, pending officer review');
  }
  if (fdr.bankAmount != null && fdr.bankAmount !== fdr.amount) {
    score -= 20;
    reasons.push('Amount mismatch between submitted and bank records');
  }
  if (fdr.isDuplicate) {
    score -= 15;
    reasons.push('Duplicate FDR number detected');
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

describe('Health Score Algorithm', () => {
  it('gives 100 to clean, bank-confirmed FDR without issues', () => {
    const fdr = {
      fdrNumber: '31422908764',
      amount: 1000000,
      bankAmount: 1000000,
      trustLevel: 'bank_confirmed',
      isDuplicate: false,
    };
    const { score, reasons } = calculateHealthScore(fdr);
    expect(score).toBe(100);
    expect(reasons.length).toBe(0);
  });

  it('penalizes unverified status and amount mismatch', () => {
    const fdr = {
      fdrNumber: '55219387640',
      amount: 1000000,
      bankAmount: 750000,
      trustLevel: 'submitted',
      isDuplicate: false,
    };
    const { score, reasons } = calculateHealthScore(fdr);
    expect(score).toBe(55); // 100 - 25 - 20
    expect(reasons).toContain('Unverified by bank or officer');
    expect(reasons).toContain('Amount mismatch between submitted and bank records');
  });

  it('penalizes duplicate FDR number', () => {
    const fdr = {
      fdrNumber: '31422908764',
      amount: 500000,
      bankAmount: 500000,
      trustLevel: 'submitted',
      isDuplicate: true,
    };
    const { score } = calculateHealthScore(fdr);
    expect(score).toBe(60); // 100 - 25 - 15
  });
});
