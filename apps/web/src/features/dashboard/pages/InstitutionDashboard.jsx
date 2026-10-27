import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { fdrApi } from '../../fdr/api';
import ActionList from '../components/ActionList';
import InstitutionDepositChart from '../components/InstitutionDepositChart';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import VerificationLevel from '../../../components/data/VerificationLevel';
import WorkflowTracker from '../../../components/data/WorkflowTracker';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency, formatDate, daysUntil } from '../../../lib/format';
import { ROUTES } from '../../../lib/constants';
import { Building2, ShieldCheck, FilePlus, Download, CheckCircle2, Clock, Landmark, GraduationCap } from 'lucide-react';
import CircularRadialTracker from '../components/CircularRadialTracker';

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

  // Calculations for institution
  const totalPledged = useMemo(
    () => fdrs.reduce((acc, f) => acc + (Number(f.amount) || 0), 0),
    [fdrs]
  );
  const requiredQuota = 15000000; // ₹1.5 Cr statutory endowment requirement for approved campus
  const quotaPercent = Math.min(100, Math.round((totalPledged / requiredQuota) * 100));

  const activeCount = fdrs.filter((f) => f.status === 'active').length;
  const expiringCount = fdrs.filter((f) => {
    const d = daysUntil(f.maturityDate);
    return d >= 0 && d <= 60 && f.status !== 'released' && f.status !== 'renewed';
  }).length;
  const pendingCount = fdrs.filter((f) => f.trustLevel !== 'bank_confirmed').length;

  // Urgent institution actions
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
      render: (r) => <span className="font-mono font-medium text-slate-900 dark:text-white">{r.fdrNumber}</span>,
    },
    { header: 'Issuing bank', accessor: 'bank', sortable: true },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium text-slate-900 dark:text-white">{formatIndianCurrency(r.amount)}</span>,
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

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  const institutionName = user?.institutionName || 'Delhi Technological University (DTU)';

  return (
    <div className="space-y-8">

      {/* ══ DEDICATED INSTITUTIONAL CAMPUS HERO BANNER ══ */}
      <div className="rounded-2xl bg-white dark:bg-[#16181d] border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-[#20232a] text-emerald-500 dark:text-emerald-400 flex items-center justify-center border border-zinc-200 dark:border-zinc-700/60 flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-100 font-display">
                  {institutionName}
                </h1>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Permanent AICTE ID: 1-4392810 • North-West Region • Technical University Campus
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mt-3">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} /> Full Statutory Cover Maintained
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>Lien Marked: Member Secretary, AICTE New Delhi</span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span>Annual Scrutiny Cycle: 2026–2027</span>
              </div>
            </div>
          </div>

          {/* Quick Institutional Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.SUBMIT_FDR)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-xs font-semibold px-4 py-2"
            >
              <FilePlus size={15} /> Pledge New Fixed Deposit
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/institution/fdrs')}
              className="gap-2 border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-200 bg-white dark:bg-[#1f2128] hover:bg-zinc-50 dark:hover:bg-[#282b35]"
            >
              <Download size={15} /> Download Custody Certificate
            </Button>
          </div>
        </div>
      </div>

      {/* ══ MANDATORY STATUTORY QUOTA CIRCULAR RADIAL TRACKER ══ */}
      <div className="rounded-2xl bg-white dark:bg-[#16181d] border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Circular Tracker Visualization */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <CircularRadialTracker
              percentage={quotaPercent}
              size={170}
              strokeWidth={13}
              primaryColor="#10b981"
              secondaryColor="#059669"
              title="Statutory Quota"
              subtitle={quotaPercent >= 100 ? 'Fully Funded' : 'Active Deficit'}
              centerValue={`${quotaPercent}%`}
            />
            <div className="text-center sm:text-left">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                AICTE Endowment Guarantee
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-100 font-display">
                {formatIndianCurrency(totalPledged)}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Pledged under APH Norms Clause 1.4
              </p>
              <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium block mt-1">
                Target: {formatIndianCurrency(requiredQuota)} Required
              </span>
            </div>
          </div>

          {/* Key Compliance Indicators Grid (Refined Mini-Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full lg:w-auto flex-1 lg:max-w-2xl border-t lg:border-t-0 lg:border-l border-zinc-200/80 dark:border-zinc-800/80 pt-4 lg:pt-0 lg:pl-8">
            <div className="bg-zinc-50/80 dark:bg-[#111215] p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Encumbered Pledges</p>
              <p className="text-lg font-bold text-zinc-950 dark:text-zinc-100 font-display mt-0.5">
                {activeCount} Deposits
              </p>
            </div>
            <div className="bg-zinc-50/80 dark:bg-[#111215] p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Maturity Notices</p>
              <p className={`text-lg font-bold font-display mt-0.5 ${expiringCount > 0 ? 'text-amber-500' : 'text-zinc-950 dark:text-zinc-100'}`}>
                {expiringCount} Deposits
              </p>
            </div>
            <div className="bg-zinc-50/80 dark:bg-[#111215] p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Bank Scrutiny</p>
              <p className="text-lg font-bold text-zinc-950 dark:text-zinc-100 font-display mt-0.5">
                {pendingCount} Deposits
              </p>
            </div>
            <div className="bg-zinc-50/80 dark:bg-[#111215] p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Coverage Gap</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-display mt-0.5">
                0 Days (Compliant)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Notices (if any) */}
      <ActionList actions={actions} />

      {/* Primary Deposit Statutory Workflow State */}
      {fdrs.length > 0 && (
        <div>
          <div className="mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Active Statutory Workflow State
            </h3>
          </div>
          <WorkflowTracker fdr={fdrs[0]} allFdrs={fdrs} />
        </div>
      )}

      {/* Interactive Bank Pledges Chart */}
      <div className="rounded-2xl bg-white dark:bg-[#16181d] p-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-100 font-display">
              Deposit Portfolio by Issuing Bank
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pledged principal amounts currently under AICTE joint regulatory custody
            </p>
          </div>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Scheduled Commercial Banks
          </span>
        </div>
        <InstitutionDepositChart fdrs={fdrs} />
      </div>

      {/* My College Fixed Deposit Ledger */}
      <div className="rounded-2xl bg-white dark:bg-[#16181d] p-6 sm:p-7 shadow-xs border border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-100 font-display">
              Institution Fixed Deposit Ledger
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Active and archived FDR guarantees pledged to AICTE New Delhi
            </p>
          </div>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
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
