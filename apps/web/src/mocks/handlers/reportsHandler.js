import { getMockFdrs } from './fdrHandler';
import { registerMockHandler } from '../../lib/apiClient';
import { daysUntil } from '../../lib/format';

export function initReportsHandler() {
  registerMockHandler('/reports/generate', async ({ params = {} }) => {
    const { reportType, bank, days } = params;
    const fdrs = getMockFdrs();

    let filtered = [...fdrs];

    if (bank && bank !== 'all') {
      filtered = filtered.filter((f) => f.bank === bank);
    }

    if (reportType === 'upcoming_maturities') {
      const maxDays = Number(days) || 60;
      filtered = filtered.filter((f) => {
        const d = daysUntil(f.maturityDate);
        return d >= 0 && d <= maxDays;
      });
    } else if (reportType === 'pending_verifications') {
      filtered = filtered.filter((f) => f.trustLevel !== 'bank_confirmed');
    } else if (reportType === 'missing_documents') {
      filtered = filtered.filter((f) => !f.documents || f.documents.length === 0);
    } else if (reportType === 'discrepancies') {
      filtered = filtered.filter(
        (f) =>
          f.isDuplicate ||
          (f.bankAmount != null && f.bankAmount !== f.amount) ||
          f.status === 'flagged',
      );
    }

    return {
      reportType,
      generatedAt: new Date().toISOString(),
      recordCount: filtered.length,
      records: filtered,
    };
  });
}
