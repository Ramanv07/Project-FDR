import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { institutionApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import VerificationLevel from '../../../components/data/VerificationLevel';
import HealthScore from '../../../components/data/HealthScore';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency, formatDate } from '../../../lib/format';
import { calculateHealthScore } from '../../../lib/healthScore';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function InstitutionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await institutionApi.getInstitutionDetail(id);
        setData(res);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-white border border-hairline rounded">
        <p className="text-xs text-gray-500">Institution record not found.</p>
      </div>
    );
  }

  const { institution, fdrs, gaps, covered, totalAmount } = data;
  const hasGaps = gaps && gaps.length > 0;

  const fdrColumns = [
    {
      header: 'FDR number',
      accessor: 'fdrNumber',
      sortable: true,
      render: (r) => <span className="font-mono font-medium text-navy-800">{r.fdrNumber}</span>,
    },
    { header: 'Bank', accessor: 'bank', sortable: true },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium">{formatIndianCurrency(r.amount)}</span>,
    },
    {
      header: 'Issue date',
      accessor: 'issueDate',
      render: (r) => formatDate(r.issueDate),
    },
    {
      header: 'Maturity date',
      accessor: 'maturityDate',
      sortable: true,
      render: (r) => formatDate(r.maturityDate),
    },
    {
      header: 'Verification level',
      accessor: 'trustLevel',
      render: (r) => <VerificationLevel level={r.trustLevel} />,
    },
    {
      header: 'Health score',
      accessor: 'healthScore',
      render: (r) => {
        const { score, reasons } = calculateHealthScore(r);
        return <HealthScore score={score} reasons={reasons} fdrNumber={r.fdrNumber} />;
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb={
          <div className="flex items-center gap-1.5">
            <Link to="/officer/institutions" className="hover:underline">
              Institutions
            </Link>
            <span>/</span>
            <span className="font-mono">{institution.aicteId}</span>
          </div>
        }
        title={institution.name}
        description={`AICTE ID: ${institution.aicteId} • ${institution.state}`}
      />

      {/* Institution Metadata Summary */}
      <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] p-5 mb-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-500 dark:text-slate-400 block">Contact person</span>
            <span className="font-medium text-gray-900 dark:text-slate-100">{institution.contactPerson}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-slate-400 block">Official email</span>
            <span className="font-medium text-gray-900 dark:text-slate-100">{institution.email}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-slate-400 block">Telephone</span>
            <span className="font-medium text-gray-900 dark:text-slate-100">{institution.phone}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-slate-400 block">Total security deposits</span>
            <span className="font-medium text-navy-800 dark:text-blue-400 text-sm">
              {formatIndianCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Coverage Gap Section for this Institution */}
      <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] p-5 mb-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-surface-200 dark:border-slate-800 mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Coverage continuity audit</h2>
          {hasGaps ? (
            <span className="inline-flex items-center gap-1 text-xs text-status-red font-medium">
              <AlertTriangle className="w-4 h-4" />
              {gaps.length} coverage lapse identified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-status-green font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Continuous unbroken coverage
            </span>
          )}
        </div>

        {/* Coverage Bars */}
        <div className="space-y-2">
          {covered.map((cov, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-xs bg-surface-50 p-2.5 rounded border border-surface-200"
            >
              <span className="font-mono font-medium text-navy-800 min-w-[130px]">
                FDR #{cov.fdrNumber}
              </span>
              <span className="text-gray-500 text-[11px] min-w-[80px]">{formatDate(cov.start)}</span>
              <div className="flex-1 h-2.5 bg-navy-700 rounded-sm" />
              <span className="text-gray-500 text-[11px] min-w-[80px] text-right">
                {formatDate(cov.end)}
              </span>
            </div>
          ))}
        </div>

        {hasGaps && (
          <div className="mt-3 pt-3 border-t border-hairline">
            {gaps.map((g, gIdx) => (
              <div
                key={gIdx}
                className="p-2.5 bg-red-50 border border-status-red rounded text-xs text-status-red flex items-center justify-between"
              >
                <span>
                  Statutory gap from <strong>{formatDate(g.start)}</strong> to{' '}
                  <strong>{formatDate(g.end)}</strong>
                </span>
                <span className="font-semibold">{g.days} days uncovered</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FDR Table for this Institution */}
      <div className="border border-hairline dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0f172a] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Pledged fixed deposits ({fdrs.length})</h2>
          <span className="text-xs text-gray-500 dark:text-slate-400">Click any row to review verification data</span>
        </div>

        <DataTable
          columns={fdrColumns}
          data={fdrs}
          onRowClick={(row) => navigate(`/officer/fdr/${row.id}/review`)}
          emptyMessage="No fixed deposit records on ledger for this institution."
        />
      </div>
    </div>
  );
}
