import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fdrApi } from '../../fdr/api';
import { releaseApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import EligibilityChecklist from '../components/EligibilityChecklist';
import FormField from '../../../components/ui/FormField';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { useToast } from '../../../components/ui/Toast';
import { formatIndianCurrency } from '../../../lib/format';
import { ROUTES } from '../../../lib/constants';

export default function ReleaseRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [fdr, setFdr] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const fdrData = await fdrApi.getFdrById(id);
        setFdr(fdrData);
        const elig = await releaseApi.checkEligibility(id);
        setEligibility(elig);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eligibility?.allRequiredMet) {
      addToast('Cannot apply: Mandatory release conditions are not yet fulfilled.', 'error');
      return;
    }
    if (!reason.trim()) {
      addToast('Please specify the justification reason for deposit release.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await releaseApi.submitRelease({
        fdrId: fdr.id,
        reason,
      });
      addToast('Application for deposit release submitted for officer scrutiny.', 'success');
      navigate(ROUTES.MY_FDRS);
    } catch (err) {
      addToast(err.message || 'Application failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Application for security deposit release"
        description={`FDR #${fdr?.fdrNumber} • ${formatIndianCurrency(fdr?.amount)} • ${fdr?.institutionName}`}
      />

      <div className="space-y-6 bg-white dark:bg-[#0f172a] border border-hairline dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed border-b border-surface-200 dark:border-slate-800 pb-4">
          Under AICTE regulations, pledged Fixed Deposit Receipts may only be released following
          successful completion of the mandated programme tenure, renewal continuity, and statutory
          clearance.
        </div>

        {/* Dynamic Eligibility Checklist */}
        <EligibilityChecklist
          items={eligibility?.items}
          allRequiredMet={eligibility?.allRequiredMet}
        />

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <FormField
            label="Statement of justification for release"
            required
            helperText="State grounds for release (e.g. Program completed tenure, closure of course, or substitution of alternate bank guarantee)"
          >
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Approved intake period completed without pending compliance observations..."
              rows={4}
              required
            />
          </FormField>

          <div className="pt-2 flex items-center justify-between border-t border-hairline">
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={!eligibility?.allRequiredMet || isSubmitting}
            >
              {isSubmitting ? 'Submitting request...' : 'Submit release request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
