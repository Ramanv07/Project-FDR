import initialVerifications from '../verifications.json';
import { getMockFdrs } from './fdrHandler';
import { registerMockHandler } from '../../lib/apiClient';
import { FDR_STATUS, TRUST_LEVELS } from '../../lib/constants';

let verifications = [...initialVerifications];

export function initVerificationHandler() {
  registerMockHandler('/verifications', async ({ params = {} }) => {
    let result = [...verifications];
    if (params.filter === 'discrepancy') {
      result = result.filter((v) => v.discrepancy);
    } else if (params.filter === 'pending') {
      result = result.filter((v) => v.status.startsWith('pending'));
    }
    return result;
  });

  registerMockHandler('/verifications/review-data', async ({ params = {} }) => {
    const fdrs = getMockFdrs();
    const fdr = fdrs.find((f) => f.id === params.id || f.fdrNumber === params.id);
    if (!fdr) throw new Error('FDR not found for verification review');

    return {
      fdr,
      submitted: {
        fdrNumber: fdr.fdrNumber,
        bank: fdr.bank,
        branch: fdr.branch || 'Main Branch',
        amount: fdr.amount,
        issueDate: fdr.issueDate,
        maturityDate: fdr.maturityDate,
        lienHolder: fdr.lienHolder,
      },
      ocr: fdr.ocrData || {
        fdrNumber: fdr.fdrNumber,
        bank: fdr.bank,
        branch: fdr.branch || 'Main Branch',
        amount: fdr.amount,
        issueDate: fdr.issueDate,
        maturityDate: fdr.maturityDate,
        lienHolder: fdr.lienHolder,
      },
      bank: fdr.bankResponse || {
        fdrNumber: fdr.fdrNumber,
        bank: fdr.bank,
        branch: fdr.branch || 'Main Branch',
        amount: fdr.bankAmount ?? fdr.amount,
        issueDate: fdr.issueDate,
        maturityDate: fdr.maturityDate,
        lienHolder: fdr.lienHolder,
        status: fdr.bankAmount && fdr.bankAmount !== fdr.amount ? 'mismatch' : 'confirmed',
      },
    };
  });

  registerMockHandler('/verifications/action', async ({ data }) => {
    const { fdrId, action, remarks, officerName } = data;
    const fdrs = getMockFdrs();
    const fdr = fdrs.find((f) => f.id === fdrId);
    if (!fdr) throw new Error('FDR record not found');

    if (action === 'approve') {
      fdr.trustLevel = TRUST_LEVELS.OFFICER_REVIEWED.key;
      fdr.status = FDR_STATUS.VERIFIED;
      fdr.timeline.push({
        event: 'Officer review: approved',
        date: new Date().toISOString().slice(0, 10),
        user: officerName || 'AICTE Officer',
      });
    } else if (action === 'flag') {
      fdr.status = FDR_STATUS.FLAGGED;
      fdr.timeline.push({
        event: `Flagged for senior scrutiny: ${remarks || 'Discrepancy noted'}`,
        date: new Date().toISOString().slice(0, 10),
        user: officerName || 'AICTE Officer',
      });
    } else if (action === 'clarification') {
      fdr.timeline.push({
        event: `Clarification requested: ${remarks || 'Additional proof requested'}`,
        date: new Date().toISOString().slice(0, 10),
        user: officerName || 'AICTE Officer',
      });
    }

    const vItem = verifications.find((v) => v.fdrId === fdrId);
    if (vItem) {
      vItem.status = action === 'approve' ? 'verified' : 'flagged';
      vItem.verifiedAt = new Date().toISOString().slice(0, 10);
      vItem.verifiedBy = officerName || 'AICTE Officer';
    }

    return { status: 'success', fdr };
  });
}
