import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fdrApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import VerificationLevel from '../../../components/data/VerificationLevel';
import StatusBadge from '../../../components/data/StatusBadge';
import HealthScore from '../../../components/data/HealthScore';
import FdrTimeline from '../components/FdrTimeline';
import DocumentPreview from '../../../components/data/DocumentPreview';
import WorkflowTracker from '../../../components/data/WorkflowTracker';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency, formatDate } from '../../../lib/format';
import { calculateHealthScore } from '../../../lib/healthScore';

export default function FdrDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fdr, setFdr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFdr() {
      try {
        const data = await fdrApi.getFdrById(id);
        setFdr(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFdr();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  if (!fdr) {
    return (
      <div className="p-8 text-center bg-white border border-hairline rounded">
        <p className="text-sm font-medium text-gray-800">FDR record not found</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const { score, reasons } = calculateHealthScore(fdr);

  return (
    <div>
      <PageHeader
        breadcrumb={
          <div className="flex items-center gap-1.5">
            <Link to="/institution/fdrs" className="hover:underline">
              FDR register
            </Link>
            <span>/</span>
            <span className="font-mono">{fdr.fdrNumber}</span>
          </div>
        }
        title={`FDR #${fdr.fdrNumber}`}
        description={`${fdr.institutionName} • ${fdr.programYear || 'Technical approval deposit'}`}
        action={
          <div className="flex items-center gap-2">
            {fdr.status !== 'released' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/institution/fdr/${fdr.id}/renew`)}
                >
                  Renew FDR
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/institution/fdr/${fdr.id}/release`)}
                >
                  Apply for release
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Verification Level & Risk Header Banner */}
      <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] p-4 mb-6 flex flex-wrap items-center justify-between gap-4 card-glass shadow-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[11px] text-gray-400 dark:text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Verification milestone</span>
            <VerificationLevel level={fdr.trustLevel} />
          </div>
          <div className="border-l border-hairline dark:border-slate-800 pl-6">
            <span className="text-[11px] text-gray-400 dark:text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Ledger status</span>
            <StatusBadge status={fdr.status} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Compliance health:</span>
          <HealthScore score={score} reasons={reasons} fdrNumber={fdr.fdrNumber} />
        </div>
      </div>

      {/* 5-Stage Live Statutory Workflow Visualizer */}
      <div className="mb-6">
        <WorkflowTracker fdr={fdr} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Fixed Deposit Certificate Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] p-5 shadow-xs">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-surface-200 dark:border-slate-800">
              Deposit specifications
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 dark:text-slate-400 block">FDR number</span>
                <span className="font-mono font-medium text-gray-900 dark:text-slate-100 text-sm">{fdr.fdrNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-400 block">Principal amount</span>
                <span className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                  {formatIndianCurrency(fdr.amount)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-400 block">Issuing bank</span>
                <span className="text-gray-900 dark:text-slate-100 font-medium">{fdr.bank}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-400 block">Branch location</span>
                <span className="text-gray-800 dark:text-slate-200">{fdr.branch || 'Main Commercial Branch'}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-400 block">Date of issue</span>
                <span className="text-gray-800 dark:text-slate-200">{formatDate(fdr.issueDate)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-400 block">Maturity date</span>
                <span className="text-gray-800 dark:text-slate-200">{formatDate(fdr.maturityDate)}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-surface-200 dark:border-slate-800">
                <span className="text-gray-500 dark:text-slate-400 block">Statutory lien holder</span>
                <span className="text-navy-800 dark:text-blue-400 font-medium">{fdr.lienHolder || 'Member Secretary, AICTE, New Delhi'}</span>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <DocumentPreview
            documentName={fdr.documents?.[0]?.name || 'FDR_Certificate.pdf'}
            fdr={fdr}
          />
        </div>

        {/* Right Column: Audit Timeline & Scrutiny Chain */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] p-5 shadow-xs">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4 pb-2 border-b border-surface-200 dark:border-slate-800">
              Verification & audit history
            </h2>
            <FdrTimeline events={fdr.timeline} />
          </div>

          {/* Bank Response Status Box */}
          {fdr.bankResponse && (
            <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] p-5 shadow-xs">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">Bank confirmation record</h2>
              <div className="text-xs space-y-1.5 text-gray-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Bank verified sum:</span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">{formatIndianCurrency(fdr.bankResponse.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Bank report:</span>
                  <span className="capitalize font-medium text-status-red">{fdr.bankResponse.status}</span>
                </div>
                {fdr.bankResponse.remarks && (
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 pt-2 border-t border-hairline dark:border-slate-800">
                    Note: {fdr.bankResponse.remarks}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
