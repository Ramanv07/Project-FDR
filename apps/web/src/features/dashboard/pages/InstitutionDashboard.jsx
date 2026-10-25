import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { fdrApi } from '../../fdr/api';
import PageHeader from '../../../components/data/PageHeader';
import StatRow from '../components/StatRow';
import ActionList from '../components/ActionList';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import VerificationLevel from '../../../components/data/VerificationLevel';
import WorkflowTracker from '../../../components/data/WorkflowTracker';
import Button from '../../../components/ui/Button';
import { formatIndianCurrency, formatDate, daysUntil } from '../../../lib/format';
import { ROUTES } from '../../../lib/constants';

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fdrs, setFdrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const instId = user?.institutionId || 'inst-01';
        const data = await fdrApi.getFdrs({ institutionId: instId });
        setFdrs(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Compute stats
  const activeCount = fdrs.filter((f) => f.status === 'active').length;
  const expiringCount = fdrs.filter((f) => {
    const d = daysUntil(f.maturityDate);
    return d >= 0 && d <= 60;
  }).length;
  const pendingCount = fdrs.filter((f) => f.trustLevel !== 'bank_confirmed').length;
  const releasedCount = fdrs.filter((f) => f.status === 'released').length;

  // Compute urgent actions
  const actions = [];
  fdrs.forEach((f) => {
    const days = daysUntil(f.maturityDate);
    if (days >= 0 && days <= 30 && f.status !== 'released' && f.status !== 'renewed') {
      actions.push({
        title: `FDR #${f.fdrNumber} matures in ${days} days`,
        description: `Sum: ${formatIndianCurrency(f.amount)} • Submit timely renewal to avoid compliance coverage gaps`,
        link: `/institution/fdr/${f.id}/renew`,
        actionLabel: 'Submit renewal',
      });
    } else if (f.status === 'flagged') {
      actions.push({
        title: `FDR #${f.fdrNumber} flagged with discrepancy`,
        description: 'Discrepancy noted during scrutiny. Inspect details and submit clarification.',
        link: `/institution/fdr/${f.id}`,
        actionLabel: 'View details',
      });
    }
  });

  const columns = [
    {
      header: 'FDR number',
      accessor: 'fdrNumber',
      sortable: true,
      render: (r) => <span className="font-mono font-medium text-navy-800">{r.fdrNumber}</span>,
    },
    { header: 'Issuing bank', accessor: 'bank', sortable: true },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium">{formatIndianCurrency(r.amount)}</span>,
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
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Institution dashboard"
        description={`${user?.institutionName || 'Technical Institution'} • Compliance overview`}
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.SUBMIT_FDR)}
          >
            Submit new FDR
          </Button>
        }
      />

      <ActionList actions={actions} />

      <StatRow
        stats={[
          { label: 'Active FDRs', value: activeCount, subtext: 'In regulatory custody' },
          { label: 'Expiring in 60 days', value: expiringCount, subtext: 'Requires renewal' },
          { label: 'Pending verification', value: pendingCount, subtext: 'Under bank/AICTE review' },
          { label: 'Released deposits', value: releasedCount, subtext: 'Completed lifecycle' },
        ]}
      />

      {/* Primary Deposit Statutory Workflow State */}
      {fdrs.length > 0 && (
        <div className="mb-6">
          <WorkflowTracker fdr={fdrs[0]} allFdrs={fdrs} />
        </div>
      )}

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-950 font-display">Institution Security Deposit Ledger</h2>
            <p className="text-xs text-slate-500">Active and archived FDR guarantees pledged to AICTE New Delhi</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {fdrs.length} deposits recorded
          </span>
        </div>

        <DataTable
          columns={columns}
          data={fdrs}
          onRowClick={(row) => navigate(`/institution/fdr/${row.id}`)}
          emptyMessage="No fixed deposit records registered for this institution."
        />
      </div>
    </div>
  );
}
