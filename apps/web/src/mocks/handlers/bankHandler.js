import initialBankRequests from '../bankRequests.json';
import { getMockFdrs } from './fdrHandler';
import { registerMockHandler } from '../../lib/apiClient';
import { signBankResponse } from '../../lib/bankSignature';
import { FDR_STATUS, TRUST_LEVELS } from '../../lib/constants';

let bankRequests = [...initialBankRequests];

export function initBankHandler() {
  registerMockHandler('/mock-bank/requests', async () => {
    return bankRequests;
  });

  registerMockHandler('/mock-bank/respond', async ({ data }) => {
    const { requestId, decision, confirmedAmount, remarks } = data;
    const req = bankRequests.find((r) => r.id === requestId);
    if (!req) throw new Error('Bank request not found');

    const payload = {
      fdrNumber: req.fdrNumber,
      claimedAmount: req.claimedAmount,
      confirmedAmount: decision === 'confirm' ? req.claimedAmount : Number(confirmedAmount) || 0,
      decision,
      bank: req.bank,
      branch: req.branch,
      timestamp: new Date().toISOString(),
    };

    const signature = await signBankResponse(payload);

    req.status = decision;
    req.signature = signature;
    req.bankConfirmedAmount = payload.confirmedAmount;
    req.remarks = remarks;

    // Update corresponding FDR
    const fdrs = getMockFdrs();
    const fdr = fdrs.find((f) => f.id === req.fdrId || f.fdrNumber === req.fdrNumber);
    if (fdr) {
      if (decision === 'confirm') {
        fdr.status = FDR_STATUS.ACTIVE;
        fdr.trustLevel = TRUST_LEVELS.BANK_CONFIRMED.key;
        fdr.bankAmount = fdr.amount;
        fdr.timeline.push({
          event: `Bank confirmed with cryptographic signature (${signature.slice(0, 10)}...)`,
          date: new Date().toISOString().slice(0, 10),
          user: `${req.bank} Automated Portal`,
        });
      } else if (decision === 'mismatch') {
        fdr.status = FDR_STATUS.FLAGGED;
        fdr.bankAmount = payload.confirmedAmount;
        fdr.timeline.push({
          event: `Bank reported amount mismatch: bank holds Rs ${payload.confirmedAmount}`,
          date: new Date().toISOString().slice(0, 10),
          user: `${req.bank} Core Banking`,
        });
      } else if (decision === 'not_found') {
        fdr.status = FDR_STATUS.FLAGGED;
        fdr.timeline.push({
          event: 'Bank reported: FDR record not found in system',
          date: new Date().toISOString().slice(0, 10),
          user: `${req.bank} Core Banking`,
        });
      }
    }

    return { request: req, signature };
  });
}
