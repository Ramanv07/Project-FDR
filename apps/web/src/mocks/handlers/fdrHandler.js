import initialFdrs from '../fdrs.json';
import { registerMockHandler } from '../../lib/apiClient';
import { FDR_STATUS, TRUST_LEVELS } from '../../lib/constants';
import { validateFdr } from '../../lib/fdrValidation';

let fdrs = [...initialFdrs];

export function getMockFdrs() {
  return fdrs;
}

export function initFdrHandler() {
  registerMockHandler('/fdrs', async ({ params = {} }) => {
    let result = [...fdrs];

    if (params.institutionId) {
      result = result.filter((f) => f.institutionId === params.institutionId);
    }
    if (params.status && params.status !== 'all') {
      result = result.filter((f) => f.status === params.status);
    }
    if (params.bank && params.bank !== 'all') {
      result = result.filter((f) => f.bank === params.bank);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (f) =>
          f.fdrNumber.toLowerCase().includes(q) ||
          f.institutionName?.toLowerCase().includes(q) ||
          f.bank.toLowerCase().includes(q),
      );
    }
    return result;
  });

  registerMockHandler('/fdrs/detail', async ({ params = {} }) => {
    const fdr = fdrs.find((f) => f.id === params.id || f.fdrNumber === params.id);
    if (!fdr) throw new Error('FDR not found');
    return fdr;
  });

  registerMockHandler('/fdrs/create', async ({ data }) => {
    const validation = validateFdr(data, fdrs);
    const isDuplicate = validation.errors.some((e) => e.field === 'fdrNumber' && e.message.includes('Duplicate'));

    const newFdr = {
      id: `fdr-${Date.now().toString().slice(-5)}`,
      ...data,
      amount: Number(data.amount),
      status: FDR_STATUS.SUBMITTED,
      trustLevel: TRUST_LEVELS.AI_CHECKED.key,
      isDuplicate,
      hasComplianceIssue: false,
      documents: data.documents || [{ name: 'FDR_Certificate_Scanned.pdf', uploadedAt: new Date().toISOString().slice(0, 10) }],
      timeline: [
        {
          event: 'Uploaded by institution',
          date: new Date().toISOString().slice(0, 10),
          user: data.submittedBy || 'Institution Official',
        },
        {
          event: 'OCR data auto-extracted',
          date: new Date().toISOString().slice(0, 10),
          user: 'System OCR',
        },
      ],
      ocrData: {
        fdrNumber: data.fdrNumber,
        bank: data.bank,
        amount: data.amount,
        issueDate: data.issueDate,
        maturityDate: data.maturityDate,
      },
    };

    fdrs.unshift(newFdr);
    return newFdr;
  });

  registerMockHandler('/fdrs/renew', async ({ data }) => {
    const oldFdr = fdrs.find((f) => f.id === data.oldFdrId);
    if (oldFdr) {
      oldFdr.status = FDR_STATUS.RENEWED;
    }

    const newFdr = {
      id: `fdr-${Date.now().toString().slice(-5)}`,
      fdrNumber: data.newFdrNumber,
      institutionId: oldFdr ? oldFdr.institutionId : data.institutionId,
      institutionName: oldFdr ? oldFdr.institutionName : data.institutionName,
      bank: data.bank,
      branch: data.branch,
      amount: Number(data.amount),
      issueDate: data.issueDate,
      maturityDate: data.maturityDate,
      lienHolder: 'AICTE, New Delhi',
      programYear: data.programYear || (oldFdr ? oldFdr.programYear : '2025-26'),
      status: FDR_STATUS.SUBMITTED,
      trustLevel: TRUST_LEVELS.AI_CHECKED.key,
      isDuplicate: false,
      hasComplianceIssue: false,
      previousFdrId: data.oldFdrId,
      documents: [{ name: 'FDR_Renewal_Bond.pdf', uploadedAt: new Date().toISOString().slice(0, 10) }],
      timeline: [
        {
          event: `Renewed against previous FDR #${oldFdr?.fdrNumber || data.oldFdrId}`,
          date: new Date().toISOString().slice(0, 10),
          user: 'Institution Official',
        },
      ],
      ocrData: {
        fdrNumber: data.newFdrNumber,
        bank: data.bank,
        amount: data.amount,
        issueDate: data.issueDate,
        maturityDate: data.maturityDate,
      },
    };

    fdrs.unshift(newFdr);
    return newFdr;
  });
}
