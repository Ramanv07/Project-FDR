import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verificationApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import CompareColumns from '../components/CompareColumns';
import VerificationLevel from '../../../components/data/VerificationLevel';
import StatusBadge from '../../../components/data/StatusBadge';
import WorkflowTracker from '../../../components/data/WorkflowTracker';
import FormField from '../../../components/ui/FormField';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../auth/useAuth';
import { ROUTES } from '../../../lib/constants';

export default function FdrReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [reviewData, setReviewData] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await verificationApi.getReviewData(id);
        setReviewData(data);
      } catch (err) {
        addToast(err.message || 'Error loading review data', 'error');
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

  if (!reviewData) {
    return (
      <div className="p-8 text-center bg-white border border-hairline rounded">
        <p className="text-xs text-gray-500">Record not found for verification review.</p>
      </div>
    );
  }

  const { fdr, submitted, ocr, bank } = reviewData;

  const handleAction = async (actionType) => {
    setIsSubmitting(true);
    try {
      await verificationApi.submitAction({
        fdrId: fdr.id,
        action: actionType,
        remarks,
        officerName: user?.name || 'AICTE Officer',
      });

      const messages = {
        approve: 'FDR verification approved on ledger.',
        flag: 'Record flagged for senior administrative scrutiny.',
        clarification: 'Clarification inquiry dispatched to institution.',
      };
      addToast(messages[actionType], 'success');
      navigate(ROUTES.VERIFICATION_QUEUE);
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={`Verification review: FDR #${fdr.fdrNumber}`}
        description={`${fdr.institutionName} • Three-way reconciliation scrutiny`}
        action={
          <div className="flex items-center gap-3">
            <VerificationLevel level={fdr.trustLevel} />
            <StatusBadge status={fdr.status} />
          </div>
        }
      />

      <div className="space-y-6">
        {/* 5-Stage Live Statutory Workflow Visualizer */}
        <WorkflowTracker fdr={fdr} />

        {/* Three Columns Comparison Component */}
        <CompareColumns submitted={submitted} ocr={ocr} bank={bank} />

        {/* Scrutiny Remarks and Decision Buttons */}
        <div className="border border-hairline rounded bg-white p-5 space-y-4">
          <h2 className="text-sm font-medium text-gray-900 pb-2 border-b border-surface-200">
            Scrutiny observations & findings
          </h2>

          <FormField
            label="Officer scrutiny remarks"
            helperText="Enter verification rationale, bank confirmation reconciliation notes, or specific clarifications needed."
          >
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Scrutinized against Bank of Baroda response. Confirmed original document seals..."
              rows={3}
            />
          </FormField>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-hairline">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(ROUTES.VERIFICATION_QUEUE)}
              disabled={isSubmitting}
            >
              Back to queue
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAction('flag')}
                disabled={isSubmitting}
              >
                Flag for senior review
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAction('clarification')}
                disabled={isSubmitting}
              >
                Request clarification
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAction('approve')}
                disabled={isSubmitting}
              >
                Approve verification
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
