import React, { useState, useEffect } from 'react';
import { releaseApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import Drawer from '../../../components/ui/Drawer';
import ApprovalChain from '../components/ApprovalChain';
import FormField from '../../../components/ui/FormField';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../auth/useAuth';
import { formatIndianCurrency, formatDate } from '../../../lib/format';

export default function ReleaseApprovals() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await releaseApi.getRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveStep = async () => {
    if (!selectedReq?.currentStep) return;

    setIsSubmitting(true);
    try {
      await releaseApi.approveStep({
        requestId: selectedReq.id,
        step: selectedReq.currentStep,
        officerName: user?.name || 'R.K. Pandey',
        remarks,
      });

      addToast(`Approval step for ${selectedReq.currentStep} recorded on ledger.`, 'success');
      setRemarks('');
      setSelectedReq(null);
      await fetchRequests();
    } catch (err) {
      addToast(err.message || 'Approval failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'FDR number',
      accessor: 'fdrNumber',
      sortable: true,
      render: (r) => <span className="font-mono font-medium text-navy-800">{r.fdrNumber}</span>,
    },
    { header: 'Institution', accessor: 'institutionName', sortable: true },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium">{formatIndianCurrency(r.amount)}</span>,
    },
    {
      header: 'Requested date',
      accessor: 'requestedAt',
      sortable: true,
      render: (r) => formatDate(r.requestedAt),
    },
    {
      header: 'Current stage',
      accessor: 'currentStep',
      render: (r) => (
        <span className="text-xs font-medium text-navy-800 uppercase tracking-wide">
          {r.currentStep ? r.currentStep.replace('_', ' ') : 'Completed'}
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
        title="Deposit release approvals"
        description="Sequential 3-tier authorization chain for returning pledged fixed deposits"
      />

      <div className="border border-hairline dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0f172a] p-5 shadow-xs">
        <DataTable
          columns={columns}
          data={requests}
          onRowClick={(row) => setSelectedReq(row)}
          emptyMessage="No pending deposit release applications."
        />
      </div>

      {/* Detail Drawer with Approval Chain */}
      <Drawer
        isOpen={Boolean(selectedReq)}
        onClose={() => setSelectedReq(null)}
        title={`Release application: FDR #${selectedReq?.fdrNumber}`}
        description={`${selectedReq?.institutionName} • ${formatIndianCurrency(selectedReq?.amount)}`}
        width="max-w-md"
      >
        {selectedReq && (
          <div className="space-y-5">
            <div className="bg-surface-50 p-3.5 rounded border border-hairline text-xs space-y-1.5">
              <p className="text-gray-500 font-medium">Institution justification:</p>
              <p className="text-gray-800 italic leading-relaxed">"{selectedReq.reason}"</p>
              <p className="text-[11px] text-gray-400 pt-1">
                Applied by {selectedReq.requestedBy} on {formatDate(selectedReq.requestedAt)}
              </p>
            </div>

            <ApprovalChain
              approvals={selectedReq.approvals}
              currentStep={selectedReq.currentStep}
            />

            {selectedReq.currentStep ? (
              <div className="pt-4 border-t border-hairline space-y-3">
                <FormField label="Scrutiny endorsement / remarks" required>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter compliance clearance remarks..."
                    rows={2}
                  />
                </FormField>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={handleApproveStep}
                >
                  {isSubmitting
                    ? 'Recording authorization...'
                    : `Approve as ${selectedReq.currentStep.replace('_', ' ')}`}
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-green-50 border border-status-green rounded text-xs text-status-green font-medium text-center">
                All approval tiers completed. Deposit released.
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
