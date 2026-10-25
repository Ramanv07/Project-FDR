import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fdrApi } from '../../fdr/api';
import { riskApi } from '../../risk/api';
import PageHeader from '../../../components/data/PageHeader';
import MaturityChart from '../components/MaturityChart';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import HealthScore from '../../../components/data/HealthScore';
import WorkflowTracker from '../../../components/data/WorkflowTracker';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency, formatDate, daysUntil } from '../../../lib/format';
import { ROUTES } from '../../../lib/constants';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [fdrs, setFdrs] = useState([]);
  const [riskQueue, setRiskQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allFdrs, riskData] = await Promise.all([
          fdrApi.getFdrs(),
          riskApi.getRiskQueue(),
        ]);
        setFdrs(allFdrs);
        setRiskQueue(riskData.slice(0, 10)); // Top 10 highest risk
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute stat counts: Active, Expiring in 30 days, Matured, Renewed, Released, Pending verification
  const counts = useMemo(() => {
    let active = 0;
    let expiring30 = 0;
    let matured = 0;
    let renewed = 0;
    let released = 0;
    let pending = 0;

    fdrs.forEach((f) => {
      if (f.status === 'active') active++;
      if (f.status === 'matured') matured++;
      if (f.status === 'renewed') renewed++;
      if (f.status === 'released') released++;
      if (f.trustLevel !== 'bank_confirmed') pending++;

      const d = daysUntil(f.maturityDate);
      if (d >= 0 && d <= 30 && f.status !== 'released' && f.status !== 'renewed') {
        expiring30++;
      }
    });

    return { active, expiring30, matured, renewed, released, pending };
  }, [fdrs]);

  // Aggregate maturities by month for plain Recharts bar chart
  const maturityChartData = useMemo(() => {
    const monthsMap = {};
    fdrs.forEach((f) => {
      if (!f.maturityDate) return;
      const d = new Date(f.maturityDate);
      if (isNaN(d.getTime())) return;
      const key = `${d.toLocaleString('en-US', { month: 'short' })} '${String(d.getFullYear()).slice(-2)}`;
      if (!monthsMap[key]) {
        monthsMap[key] = { month: key, count: 0, totalAmount: 0, sortKey: d.getTime() };
      }
      monthsMap[key].count += 1;
      monthsMap[key].totalAmount += f.amount || 0;
    });

    return Object.values(monthsMap)
      .sort((a, b) => a.sortKey - b.sortKey)
      .slice(0, 10);
  }, [fdrs]);

  const riskColumns = [
    {
      header: 'Score',
      accessor: 'healthScore',
      sortable: true,
      render: (r) => (
        <HealthScore score={r.healthScore} reasons={r.riskReasons} fdrNumber={r.fdrNumber} />
      ),
    },
    {
      header: 'FDR number',
      accessor: 'fdrNumber',
      sortable: true,
      render: (r) => <span className="font-mono font-medium text-navy-800">{r.fdrNumber}</span>,
    },
    { header: 'Institution', accessor: 'institutionName', sortable: true },
    {
      header: 'Deposit sum',
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
      header: 'Reason for risk flag',
      accessor: 'reasonSummary',
      render: (r) => (
        <span className="text-xs text-status-red leading-tight">
          {r.riskReasons?.[0] || 'Unverified record'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Officer dashboard"
        description="National regulatory overview of fixed deposit security guarantees"
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(ROUTES.VERIFICATION_QUEUE)}
            >
              Verification queue ({counts.pending})
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.RISK_QUEUE)}
            >
              Open risk queue
            </Button>
          </div>
        }
      />

      {/* Row of Counts: Active, Expiring in 30 days, Matured, Renewed, Released, Pending verification */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <div className="bg-white border border-slate-300 rounded p-3">
          <p className="text-[11px] font-medium text-slate-500 mb-0.5">Active</p>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{counts.active}</span>
          <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Valid cover</p>
        </div>

        <div className="bg-white border border-amber-300 rounded p-3">
          <p className="text-[11px] font-medium text-amber-800 mb-0.5">Expiring in 30d</p>
          <span className="text-xl font-bold text-amber-700 tabular-nums">
            {counts.expiring30}
          </span>
          <p className="text-[10px] text-amber-700 mt-0.5 font-medium">Needs renewal</p>
        </div>

        <div className="bg-white border border-red-300 rounded p-3">
          <p className="text-[11px] font-medium text-red-800 mb-0.5">Matured</p>
          <span className="text-xl font-bold text-red-700 tabular-nums">{counts.matured}</span>
          <p className="text-[10px] text-red-700 mt-0.5 font-medium">Lapsed / due</p>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3">
          <p className="text-[11px] font-medium text-slate-500 mb-0.5">Renewed</p>
          <span className="text-xl font-bold text-slate-800 tabular-nums">{counts.renewed}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Chained</p>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3">
          <p className="text-[11px] font-medium text-slate-500 mb-0.5">Released</p>
          <span className="text-xl font-bold text-slate-800 tabular-nums">{counts.released}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Closed</p>
        </div>

        <div className="bg-white border border-blue-300 rounded p-3">
          <p className="text-[11px] font-medium text-blue-900 mb-0.5">Pending Scrutiny</p>
          <span className="text-xl font-bold text-[#1F3A5F] tabular-nums">{counts.pending}</span>
          <p className="text-[10px] text-blue-700 mt-0.5 font-medium">Officer queue</p>
        </div>
      </div>

      {/* Live 5-Stage Workflow Engine Tracker Showcase */}
      {fdrs.length > 0 && (
        <div className="mb-6">
          <WorkflowTracker fdr={fdrs[0]} />
        </div>
      )}

      {/* Bar Chart of Maturities by Month */}
      <div className="border border-hairline rounded bg-white p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Upcoming maturities schedule</h2>
            <p className="text-xs text-gray-500">Number of fixed deposits maturing by calendar month</p>
          </div>
          <span className="text-xs text-gray-400">Values in counts</span>
        </div>
        <MaturityChart data={maturityChartData} />
      </div>

      {/* Top 10 Risk-Queue Rows Below */}
      <div className="border border-hairline rounded bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Top high-risk FDRs requiring scrutiny</h2>
            <p className="text-xs text-gray-500">Sorted by lowest health score (highest risk first)</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.RISK_QUEUE)}
          >
            View all ({riskQueue.length}+) →
          </Button>
        </div>

        <DataTable
          columns={riskColumns}
          data={riskQueue}
          onRowClick={(row) => navigate(`/officer/fdr/${row.id}/review`)}
          emptyMessage="No high risk fixed deposits identified."
        />
      </div>
    </div>
  );
}
