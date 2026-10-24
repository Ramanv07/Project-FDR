import initialReleaseRequests from '../releaseRequests.json';
import { getMockFdrs } from './fdrHandler';
import { registerMockHandler } from '../../lib/apiClient';
import { checkEligibility } from '../../lib/eligibility';
import { FDR_STATUS, RELEASE_STATUS } from '../../lib/constants';

let releaseRequests = [...initialReleaseRequests];

export function initReleaseHandler() {
  registerMockHandler('/release/requests', async ({ params = {} }) => {
    let result = [...releaseRequests];
    if (params.institutionId) {
      result = result.filter((r) => r.institutionId === params.institutionId);
    }
    if (params.status && params.status !== 'all') {
      result = result.filter((r) => r.status === params.status);
    }
    return result;
  });

  registerMockHandler('/release/check-eligibility', async ({ params = {} }) => {
    const fdrs = getMockFdrs();
    const fdr = fdrs.find((f) => f.id === params.fdrId);
    if (!fdr) throw new Error('FDR not found');
    return checkEligibility(fdr);
  });

  registerMockHandler('/release/submit', async ({ data }) => {
    const fdrs = getMockFdrs();
    const fdr = fdrs.find((f) => f.id === data.fdrId);
    if (!fdr) throw new Error('FDR record not found');

    const eligibility = checkEligibility(fdr);
    if (!eligibility.allRequiredMet) {
      throw new Error('Cannot submit release: Required eligibility conditions not fulfilled');
    }

    const newReq = {
      id: `rel-${Date.now().toString().slice(-4)}`,
      fdrId: fdr.id,
      fdrNumber: fdr.fdrNumber,
      institutionId: fdr.institutionId,
      institutionName: fdr.institutionName,
      amount: fdr.amount,
      reason: data.reason,
      requestedAt: new Date().toISOString().slice(0, 10),
      requestedBy: data.requestedBy || 'Institution Official',
      status: RELEASE_STATUS.PENDING,
      currentStep: 'officer',
      approvals: [
        { step: 'officer', approvedBy: null, approvedAt: null, remarks: null },
        { step: 'section_head', approvedBy: null, approvedAt: null, remarks: null },
        { step: 'competent_authority', approvedBy: null, approvedAt: null, remarks: null },
      ],
    };

    releaseRequests.unshift(newReq);
    return newReq;
  });

  registerMockHandler('/release/approve-step', async ({ data }) => {
    const { requestId, step, officerName, remarks } = data;
    const req = releaseRequests.find((r) => r.id === requestId);
    if (!req) throw new Error('Release request not found');

    const stepObj = req.approvals.find((a) => a.step === step);
    if (stepObj) {
      stepObj.approvedBy = officerName;
      stepObj.approvedAt = new Date().toISOString().slice(0, 10);
      stepObj.remarks = remarks || 'Approved';
    }

    if (step === 'officer') {
      req.status = RELEASE_STATUS.OFFICER_APPROVED;
      req.currentStep = 'section_head';
    } else if (step === 'section_head') {
      req.status = RELEASE_STATUS.SECTION_HEAD_APPROVED;
      req.currentStep = 'competent_authority';
    } else if (step === 'competent_authority') {
      req.status = RELEASE_STATUS.RELEASED;
      req.currentStep = null;

      // Update FDR status to RELEASED
      const fdrs = getMockFdrs();
      const fdr = fdrs.find((f) => f.id === req.fdrId);
      if (fdr) {
        fdr.status = FDR_STATUS.RELEASED;
        fdr.timeline.push({
          event: 'Security deposit released by Competent Authority',
          date: new Date().toISOString().slice(0, 10),
          user: officerName || 'AICTE Competent Authority',
        });
      }
    }

    return req;
  });
}
