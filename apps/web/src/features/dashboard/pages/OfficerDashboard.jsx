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
  const [selectedFdrId, setSelectedFdrId] = useState(null);
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
        if (allFdrs.length > 0 && !selectedFdrId) {
          setSelectedFdrId(allFdrs[0].id);
        }
        setRiskQueue(riskData.slice(0, 10)); // Top 10 highest risk
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentFdr = useMemo(
    () => fdrs.find((f) => f.id === selectedFdrId) || fdrs[0],
    [fdrs, selectedFdrId]
  );

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Active Deposits</p>
          <span className="text-2xl font-bold text-slate-950 dark:text-white font-display tabular-nums">{counts.active}</span>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Valid Cover
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-amber-200 dark:border-amber-900/60 rounded-xl p-3.5 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all">
          <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 mb-1">Expiring in 30d</p>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-display tabular-nums">
            {counts.expiring30}
          </span>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Renewal Required
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-rose-200 dark:border-rose-900/60 rounded-xl p-3.5 shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition-all">
          <p className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 mb-1">Matured / Lapsed</p>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-display tabular-nums">{counts.matured}</span>
          <p className="text-[10px] text-rose-700 dark:text-rose-400 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Statutory Notice
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Renewed (Chained)</p>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-display tabular-nums">{counts.renewed}</span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">No Gap Logged</p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Released Deposits</p>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 font-display tabular-nums">{counts.released}</span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Mandate Closed</p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-blue-200 dark:border-blue-900/60 rounded-xl p-3.5 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all">
          <p className="text-[11px] font-semibold text-blue-900 dark:text-blue-300 mb-1">Pending Scrutiny</p>
          <span className="text-2xl font-bold text-blue-800 dark:text-blue-400 font-display tabular-nums">{counts.pending}</span>
          <p className="text-[10px] text-blue-700 dark:text-blue-400 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Officer In-Tray
          </p>
        </div>
      </div>

      {/* Live 5-Stage Workflow Engine Tracker Showcase */}
      {fdrs.length > 0 && (
        <div className="mb-6">
          <WorkflowTracker
            fdr={currentFdr || fdrs[0]}
            allFdrs={fdrs}
            onSelectFdr={(id) => setSelectedFdrId(id)}
          />
        </div>
      )}

      {/* Bar Chart of Maturities by Month */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0f172a] p-6 mb-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white font-display">Upcoming Maturities Schedule</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Security deposits reaching maturity by calendar month across all jurisdictions</p>
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-300 bg-slate-50 dark:bg-[#141f36] px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            Total Deposit Units
          </span>
        </div>
        <MaturityChart data={maturityChartData} />
      </div>

      {/* Top 10 Risk-Queue Rows Below */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0f172a] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white font-display">Priority High-Risk Scrutiny Queue</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fixed deposits requiring immediate officer intervention (ordered by risk score)</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.RISK_QUEUE)}
          >
            Open Full Queue ({riskQueue.length}+) →
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
