import { getMockFdrs } from './fdrHandler';
import { registerMockHandler } from '../../lib/apiClient';
import { calculateHealthScore } from '../../lib/healthScore';
import { detectCoverageGaps } from '../../lib/gapDetection';
import institutionsData from '../institutions.json';

export function initRiskHandler() {
  registerMockHandler('/risk/queue', async () => {
    const fdrs = getMockFdrs();
    const scored = fdrs.map((fdr) => {
      const { score, reasons } = calculateHealthScore(fdr);
      return {
        ...fdr,
        healthScore: score,
        riskReasons: reasons,
        reasonSummary: reasons.length > 0 ? reasons.join('; ') : 'No anomalies detected',
      };
    });

    // Lowest health score first (highest risk)
    scored.sort((a, b) => a.healthScore - b.healthScore);
    return scored;
  });

  registerMockHandler('/risk/coverage-gaps', async ({ params = {} }) => {
    const fdrs = getMockFdrs();
    const instId = params.institutionId;

    if (instId) {
      const instFdrs = fdrs.filter((f) => f.institutionId === instId);
      const inst = institutionsData.find((i) => i.id === instId);
      const { gaps, covered } = detectCoverageGaps(instFdrs);
      return {
        institution: inst,
        fdrs: instFdrs,
        gaps,
        covered,
      };
    }

    // All institutions summary of gaps
    const results = institutionsData.map((inst) => {
      const instFdrs = fdrs.filter((f) => f.institutionId === inst.id);
      const { gaps, covered } = detectCoverageGaps(instFdrs);
      return {
        institution: inst,
        fdrCount: instFdrs.length,
        hasGaps: gaps.length > 0,
        gapCount: gaps.length,
        totalGapDays: gaps.reduce((acc, g) => acc + g.days, 0),
        gaps,
        covered,
      };
    });

    return results;
  });
}
