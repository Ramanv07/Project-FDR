import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileCheck2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Lock,
  Unlock,
  AlertTriangle,
  Fingerprint,
  FileSignature,
  Building,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import Button from '../ui/Button';
import { formatIndianCurrency, formatDate, daysUntil } from '../../lib/format';
import { ROUTES } from '../../lib/constants';

export default function WorkflowTracker({ 
  fdr, 
  allFdrs = [], 
  onSelectFdr, 
  className = '' 
}) {
  const navigate = useNavigate();
  // Default to Stage 4 or Stage 3 for visibility
  const [activeStage, setActiveStage] = useState(4);
  const [selectedFdrId, setSelectedFdrId] = useState(fdr?.id || '');

  // Local interactive simulation state for Stage 4 (3-Tier Release Sign-off)
  const [simulatedReleaseLevels, setSimulatedReleaseLevels] = useState({
    level1: false, // Maker: Scrutiny Officer
    level2: false, // Checker: Regional Director
    level3: false, // Authority: Member Secretary AICTE
  });

  // Local interactive simulation state for Stage 5 (Renewal Chain)
  const [simulatedRenewed, setSimulatedRenewed] = useState(false);

  // Active FDR resolution
  const activeFdr = (allFdrs.length > 0 && selectedFdrId)
    ? allFdrs.find((f) => f.id === selectedFdrId) || fdr
    : fdr;

  const handleFdrChange = (e) => {
    const newId = e.target.value;
    setSelectedFdrId(newId);
    if (onSelectFdr) onSelectFdr(newId);
    // Reset simulation on FDR switch
    setSimulatedReleaseLevels({ level1: false, level2: false, level3: false });
    setSimulatedRenewed(false);
  };

  const daysLeft = daysUntil(activeFdr?.maturityDate);
  const isExpiring = daysLeft >= 0 && daysLeft <= 60;
  const isMatured = daysLeft < 0 || activeFdr?.status === 'matured';
  const isBankConfirmed = activeFdr?.trustLevel === 'bank_confirmed' || activeFdr?.bankAmount != null;
  const isOfficerApproved = activeFdr?.trustLevel === 'officer_reviewed' || isBankConfirmed || activeFdr?.status === 'verified' || activeFdr?.status === 'active';
  
  // Real or simulated release
  const isFullyReleased = activeFdr?.status === 'released' || simulatedReleaseLevels.level3;
  const isReleaseInProgress = simulatedReleaseLevels.level1 || simulatedReleaseLevels.level2;

  // Real or simulated renewal
  const isChainRenewed = activeFdr?.status === 'renewed' || Boolean(activeFdr?.previousFdrId) || simulatedRenewed;

  // 1. Submit & Auto-Check
  const stage1Substeps = [
    { 
      label: 'Instrument Upload & AES-256 Vault', 
      done: true, 
      tag: 'SHA-256 Sealed',
      detail: `${activeFdr?.documents?.[0]?.name || 'FDR_Certificate.pdf'} stored in regulatory repository`
    },
    { 
      label: 'AI PaddleOCR Data Extraction', 
      done: true, 
      tag: 'Confidence 98.4%',
      detail: `Extracted: ${activeFdr?.bank || 'SBI'} • ${formatIndianCurrency(activeFdr?.amount || 1000000)} • Mat: ${formatDate(activeFdr?.maturityDate)}`
    },
    { 
      label: 'Duplicate Hash & Collision Check', 
      done: !activeFdr?.isDuplicate, 
      warn: activeFdr?.isDuplicate, 
      tag: activeFdr?.isDuplicate ? 'COLLISION' : 'Unique Record',
      detail: activeFdr?.isDuplicate ? 'Duplicate certificate detected' : 'Zero collision in national AICTE database'
    },
    { 
      label: 'Mandatory AICTE Joint Lien Clause', 
      done: !activeFdr?.hasComplianceIssue, 
      tag: 'Lien Endorsed',
      detail: 'Marked in favour of Member Secretary, AICTE, New Delhi'
    },
  ];

  // 2. Scrutiny & Bank Check
  const stage2Substeps = [
    { 
      label: 'Three-Way Match Reconciliation', 
      done: isOfficerApproved, 
      tag: '100% Match',
      detail: `Institution Claim (${formatIndianCurrency(activeFdr?.amount)}) = OCR Extracted = CBS Record`
    },
    { 
      label: 'Core Bank Confirmation (Digital HMAC)', 
      done: isBankConfirmed, 
      tag: isBankConfirmed ? 'Tier T2 Confirmed' : 'In-Flight',
      detail: isBankConfirmed ? `${activeFdr?.bank} (${activeFdr?.branch || 'Main Branch'}) confirmed lien` : 'Awaiting core banking webhook reply'
    },
    { 
      label: 'AICTE Officer Scrutiny Clearance', 
      done: isOfficerApproved, 
      tag: isOfficerApproved ? 'Officer Passed' : 'Pending',
      detail: isOfficerApproved ? 'Verified by AICTE Scrutiny Officer (R.K. Pandey)' : 'Awaiting officer sign-off'
    },
    { 
      label: 'NeSL Inter-Bank Protocol', 
      done: activeFdr?.trustLevel === 'api_verified', 
      tag: activeFdr?.trustLevel === 'api_verified' ? 'Tier T3 API' : 'Protocol Ready',
      detail: 'Electronic guarantee contract registered'
    },
  ];

  // 3. Monitor & Escalate
  const stage3Substeps = [
    { 
      label: 'Continuous Regulatory Custody', 
      done: !isMatured && !isFullyReleased, 
      tag: isMatured ? 'Lapsed' : 'Active Custody',
      detail: isMatured ? 'Maturity date passed without renewal' : `Valid guarantee cover active (${daysLeft > 0 ? `${daysLeft} days remaining` : 'Due'})`
    },
    { 
      label: 'Daily Scheduled Sentinel Checks', 
      done: true, 
      tag: 'Sentinel 24/7',
      detail: 'Automated daemon scans bank CBS status and statutory periods'
    },
    { 
      label: 'Pre-Expiry Escalation Ladder (T-90/60/30/7)', 
      done: isExpiring || isMatured, 
      tag: isMatured ? 'Statutory Alert' : isExpiring ? 'Notice Dispatched' : 'Standing By',
      detail: isExpiring ? 'Automated renewal notice sent to Principal & Finance Registrar' : 'Triggers automated alerts 60 and 30 days prior to maturity'
    },
    { 
      label: 'Statutory Coverage Gap Audit', 
      done: true, 
      tag: '0 Days Gap',
      detail: 'No coverage lapse registered during approved academic tenure'
    },
  ];

  // 4. Release / Refund
  const stage4Substeps = [
    { 
      label: 'Statutory Eligibility Verification', 
      done: isFullyReleased || isMatured || isReleaseInProgress, 
      tag: isFullyReleased ? 'Completed' : (daysLeft > 0 && !isReleaseInProgress) ? 'Under Lien' : 'Eligible',
      detail: (daysLeft > 0 && !isReleaseInProgress && !isFullyReleased) 
        ? `Lien active until maturity date (${formatDate(activeFdr?.maturityDate)}). Early release requires Council sanction.`
        : 'Tenure requirement completed or early release sanctioned'
    },
    { 
      label: 'Level 1: Scrutiny Officer Sign-off (Maker)', 
      done: isFullyReleased || simulatedReleaseLevels.level1, 
      tag: (isFullyReleased || simulatedReleaseLevels.level1) ? 'Cleared' : 'Pending',
      detail: (isFullyReleased || simulatedReleaseLevels.level1) ? 'Officer R.K. Pandey cleared financial standing' : 'Inspects zero pending compliance inquiries'
    },
    { 
      label: 'Level 2: Regional Director Review (Checker)', 
      done: isFullyReleased || simulatedReleaseLevels.level2, 
      tag: (isFullyReleased || simulatedReleaseLevels.level2) ? 'Cleared' : 'Pending',
      detail: (isFullyReleased || simulatedReleaseLevels.level2) ? 'Regional Directorate approved deposit release' : 'Inspects institutional accreditation standing'
    },
    { 
      label: 'Level 3: Member Secretary AICTE e-Sign', 
      done: isFullyReleased, 
      tag: isFullyReleased ? 'e-Signed' : 'Awaiting Signatures',
      detail: isFullyReleased ? 'Digital release mandate dispatched to issuing bank' : 'Final digital certificate release order'
    },
  ];

  // 5. Renewal & History
  const stage5Substeps = [
    { 
      label: 'Parent-Child Succession Bond Chaining', 
      done: isChainRenewed, 
      tag: isChainRenewed ? 'Chained' : 'Single Bond',
      detail: isChainRenewed ? 'Deposit renewal linked to predecessor certificate' : 'Initial grant deposit. Will chain to successor on renewal.'
    },
    { 
      label: 'Zero Coverage Gap Continuous Audit', 
      done: true, 
      tag: 'Certified Continuous',
      detail: 'Overlap period validated with zero uncovered calendar days'
    },
    { 
      label: 'Cryptographic SHA-256 Ledger Audit', 
      done: true, 
      tag: 'Merkle Root Sealed',
      detail: 'Historical transitions preserved on immutable tamper-evident ledger'
    },
  ];

  const stages = [
    {
      id: 1,
      name: '1. Submit & Auto-Check',
      desc: 'OCR, vault & integrity checks',
      icon: FileCheck2,
      done: true,
      active: false,
      substeps: stage1Substeps,
      statusLabel: 'Verified',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 2,
      name: '2. Scrutiny & Bank Check',
      desc: 'Officer review & signed bank reply',
      icon: ShieldCheck,
      done: isBankConfirmed,
      active: !isBankConfirmed && isOfficerApproved,
      substeps: stage2Substeps,
      statusLabel: isBankConfirmed ? 'Verified' : 'In Review',
      statusColor: isBankConfirmed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 3,
      name: '3. Monitor & Escalate',
      desc: 'Daily timeline & reminder escalation',
      icon: Clock,
      done: !isMatured && !isFullyReleased,
      active: isExpiring || isMatured,
      substeps: stage3Substeps,
      statusLabel: isMatured ? 'Matured / Lapsed' : isExpiring ? 'Expiring Soon' : 'Active Custody',
      statusColor: isMatured ? 'bg-rose-100 text-rose-800 border-rose-300' : isExpiring ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 4,
      name: '4. Release / Refund',
      desc: '3-tier authority approval & e-Sign',
      icon: CheckCircle2,
      done: isFullyReleased,
      active: isReleaseInProgress || activeFdr?.status === 'release_requested',
      substeps: stage4Substeps,
      statusLabel: isFullyReleased ? 'Released' : isReleaseInProgress ? 'In Approval' : 'Under Lien',
      statusColor: isFullyReleased ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : isReleaseInProgress ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      id: 5,
      name: '5. Renewal & History',
      desc: 'Parent-child unbroken bond chain',
      icon: RefreshCw,
      done: isChainRenewed,
      active: false,
      substeps: stage5Substeps,
      statusLabel: isChainRenewed ? 'Chained' : 'Single Bond',
      statusColor: isChainRenewed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300',
    },
  ];

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all ${className}`}>
      {/* Header bar with Interactive Deposit Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              AICTE Regulatory Workflow Engine
            </span>

            {/* If allFdrs is provided, render an interactive dropdown so the user can inspect ANY deposit! */}
            {allFdrs.length > 0 ? (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-2 py-0.5 rounded-lg">
                <span className="text-[11px] text-slate-500 font-semibold">Inspect Deposit:</span>
                <select
                  value={selectedFdrId}
                  onChange={handleFdrChange}
                  className="bg-transparent text-xs font-mono font-bold text-slate-900 border-none focus:outline-none cursor-pointer"
                >
                  {allFdrs.map((f) => (
                    <option key={f.id} value={f.id}>
                      #{f.fdrNumber} — {f.institutionName?.slice(0, 24)} ({formatIndianCurrency(f.amount)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Deposit #{activeFdr?.fdrNumber || 'Draft'}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1 font-medium">
            Five-stage statutory verification and lifecycle tracking • {activeFdr?.institutionName || 'AICTE Technical Institution'}
          </p>
        </div>

        {/* Right status pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px]">Principal Deposit:</span>
            <span className="font-bold font-mono text-slate-900">
              {formatIndianCurrency(activeFdr?.amount || 1000000)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px]">Assigned Tier:</span>
            <span className="font-bold text-blue-900 font-mono">
              {activeFdr?.trustLevel === 'bank_confirmed' ? 'Tier T2 (Bank-Confirmed)' : 
               activeFdr?.trustLevel === 'api_verified' ? 'Tier T3 (NeSL API)' :
               activeFdr?.trustLevel === 'officer_reviewed' ? 'Tier T2 (Officer-Reviewed)' :
               activeFdr?.trustLevel === 'ai_checked' ? 'Tier T1 (OCR Checked)' : 'Tier T0 (Declared)'}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Process Stage Cards / Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stages.map((stage) => {
          const isSelected = activeStage === stage.id;
          return (
            <div
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`cursor-pointer rounded-xl p-3 border transition-all select-none relative ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/30 shadow-xs'
                  : stage.done
                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  : stage.active
                  ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold font-mono text-slate-700">
                  STAGE {stage.id}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${stage.statusColor}`}>
                  {stage.statusLabel}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {stage.name.replace(/^[0-9]\.\s*/, '')}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-tight line-clamp-2">
                {stage.desc}
              </p>

              {/* Indicator dot */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{stage.substeps.length} checks</span>
                <span className="font-semibold text-blue-700">
                  {isSelected ? 'Viewing Details ↓' : 'Click to inspect'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Stage Checklist Drawer with Real Data & Live Actions */}
      {activeStage && (
        <div className="mt-4 p-5 bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 font-display">
                  Stage {activeStage}: {stages.find(s => s.id === activeStage)?.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stages.find(s => s.id === activeStage)?.statusColor}`}>
                  {stages.find(s => s.id === activeStage)?.statusLabel}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Statutory audit records for Deposit #{activeFdr?.fdrNumber} ({activeFdr?.bank})
              </p>
            </div>

            {/* Quick action buttons depending on active stage */}
            <div className="flex items-center gap-2">
              {activeStage === 1 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/officer/fdr/${activeFdr?.id}/review`)}
                >
                  View OCR Certificate Extraction →
                </Button>
              )}

              {activeStage === 2 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(ROUTES.MOCK_BANK)}
                >
                  Open Core Banking Simulator →
                </Button>
              )}

              {activeStage === 3 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(ROUTES.COVERAGE_GAP)}
                >
                  View Timeline & Gap Audits →
                </Button>
              )}

              <button
                type="button"
                onClick={() => setActiveStage(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
              >
                Close
              </button>
            </div>
          </div>

          {/* Special Interactive Section for Stage 4 (Release) */}
          {activeStage === 4 && (
            <div className="mb-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-blue-200/80">
                <div>
                  <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5 font-display">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    Three-Level Statutory Lien Release Workflow Simulator
                  </h4>
                  <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                    Under AICTE regulations, security deposits remain under mandatory lien until maturity.
                    Early release or end-of-term refund requires a three-level Maker-Checker-Signatory hierarchy.
                  </p>
                </div>

                {isFullyReleased ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Fully Authorized & e-Signed
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        if (!simulatedReleaseLevels.level1) {
                          setSimulatedReleaseLevels(prev => ({ ...prev, level1: true }));
                        } else if (!simulatedReleaseLevels.level2) {
                          setSimulatedReleaseLevels(prev => ({ ...prev, level2: true }));
                        } else {
                          setSimulatedReleaseLevels({ level1: true, level2: true, level3: true });
                        }
                      }}
                    >
                      {!simulatedReleaseLevels.level1
                        ? 'Execute Level 1 (Officer Sign-off)'
                        : !simulatedReleaseLevels.level2
                        ? 'Execute Level 2 (Regional Director)'
                        : 'Execute Level 3 (Member Secretary e-Sign)'}
                    </Button>

                    {(simulatedReleaseLevels.level1 || simulatedReleaseLevels.level2 || simulatedReleaseLevels.level3) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSimulatedReleaseLevels({ level1: false, level2: false, level3: false })}
                      >
                        Reset Simulator
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* 3 Steps Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg border text-xs ${
                  simulatedReleaseLevels.level1 || isFullyReleased
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px]">Level 1: Maker</span>
                    <span className="text-[10px] font-semibold font-mono">
                      {simulatedReleaseLevels.level1 || isFullyReleased ? '✓ Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="font-semibold text-xs">Scrutiny Officer</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Audits compliance & student inquiry zero-complaint record</p>
                </div>

                <div className={`p-3 rounded-lg border text-xs ${
                  simulatedReleaseLevels.level2 || isFullyReleased
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px]">Level 2: Checker</span>
                    <span className="text-[10px] font-semibold font-mono">
                      {simulatedReleaseLevels.level2 || isFullyReleased ? '✓ Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="font-semibold text-xs">Regional Director</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Clears territorial jurisdiction & statutory duration</p>
                </div>

                <div className={`p-3 rounded-lg border text-xs ${
                  isFullyReleased
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px]">Level 3: Signatory</span>
                    <span className="text-[10px] font-semibold font-mono">
                      {isFullyReleased ? '✓ e-Signed' : 'Pending'}
                    </span>
                  </div>
                  <p className="font-semibold text-xs">Member Secretary, AICTE</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Generates cryptographic release dispatch token to bank</p>
                </div>
              </div>
            </div>
          )}

          {/* Special Interactive Section for Stage 5 (Renewal) */}
          {activeStage === 5 && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 font-display">
                    <RefreshCw className="w-4 h-4 text-amber-700" />
                    Parent-Child Succession Chain Status
                  </h4>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    {isChainRenewed
                      ? `Successfully chained to predecessor deposit. Zero coverage gap validated.`
                      : `Initial grant deposit (#${activeFdr?.fdrNumber}). When renewal occurs, this record chains with SHA-256 integrity.`}
                  </p>
                </div>

                {!isChainRenewed && (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setSimulatedRenewed(true)}
                  >
                    Simulate Renewal Chaining →
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stages
              .find((s) => s.id === activeStage)
              ?.substeps.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0 ${
                      sub.done ? 'bg-emerald-600 text-white' : sub.warn ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {sub.done ? '✓' : sub.warn ? '!' : '·'}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-slate-900">{sub.label}</span>
                      {sub.detail && (
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {sub.detail}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                    {sub.tag}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
