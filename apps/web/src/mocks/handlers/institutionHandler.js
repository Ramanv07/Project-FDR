import institutionsData from '../institutions.json';
import { getMockFdrs } from './fdrHandler';
import { registerMockHandler } from '../../lib/apiClient';
import { detectCoverageGaps } from '../../lib/gapDetection';

export function initInstitutionHandler() {
  registerMockHandler('/institutions', async ({ params = {} }) => {
    const fdrs = getMockFdrs();
    let list = institutionsData.map((inst) => {
      const instFdrs = fdrs.filter((f) => f.institutionId === inst.id);
      const totalAmount = instFdrs.reduce((acc, f) => acc + (f.amount || 0), 0);
      const activeCount = instFdrs.filter((f) => f.status === 'active').length;
      const flaggedCount = instFdrs.filter((f) => f.status === 'flagged' || f.isDuplicate).length;

      return {
        ...inst,
        fdrCount: instFdrs.length,
        totalAmount,
        activeCount,
        flaggedCount,
      };
    });

    if (params.state && params.state !== 'all') {
      list = list.filter((i) => i.state === params.state);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.aicteId.toLowerCase().includes(q) ||
          i.state.toLowerCase().includes(q),
      );
    }
    return list;
  });

  registerMockHandler('/institutions/detail', async ({ params = {} }) => {
    const inst = institutionsData.find((i) => i.id === params.id || i.aicteId === params.id);
    if (!inst) throw new Error('Institution not found');

    const fdrs = getMockFdrs();
    const instFdrs = fdrs.filter((f) => f.institutionId === inst.id);
    const { gaps, covered } = detectCoverageGaps(instFdrs);
    const totalAmount = instFdrs.reduce((acc, f) => acc + (f.amount || 0), 0);

    return {
      institution: inst,
      fdrs: instFdrs,
      gaps,
      covered,
      totalAmount,
    };
  });
}
