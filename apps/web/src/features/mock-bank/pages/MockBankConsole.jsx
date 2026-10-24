import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockBankApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import Button from '../../../components/ui/Button';
import Dialog from '../../../components/ui/Dialog';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Spinner from '../../../components/feedback/Spinner';
import { useToast } from '../../../components/ui/Toast';
import { formatIndianCurrency, formatDate, hashPrefix } from '../../../lib/format';
import { ROUTES } from '../../../lib/constants';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function MockBankConsole() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [mismatchModalOpen, setMismatchModalOpen] = useState(false);
  const [mismatchAmount, setMismatchAmount] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await mockBankApi.getRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (req, decision, confirmedAmt = null) => {
    setIsResponding(true);
    try {
      const res = await mockBankApi.respondToRequest({
        requestId: req.id,
        decision,
        confirmedAmount: confirmedAmt != null ? confirmedAmt : req.claimedAmount,
        remarks:
          decision === 'mismatch'
            ? `Bank ledger holds deposit of Rs ${confirmedAmt}`
            : decision === 'not_found'
              ? 'No matching FDR record on bank CBS'
              : 'Confirmed deposit in full',
      });

      addToast(
        `Digital signature generated: ${res.signature.slice(0, 12)}... Record dispatched to AICTE ledger.`,
        'success',
      );
      setMismatchModalOpen(false);
      await fetchRequests();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsResponding(false);
    }
  };

  const columns = [
    {
      header: 'Request ID',
      accessor: 'id',
      width: '100px',
      render: (r) => <span className="font-mono text-gray-500">{r.id}</span>,
    },
    {
      header: 'FDR number',
      accessor: 'fdrNumber',
      sortable: true,
      render: (r) => <span className="font-mono font-medium text-navy-800">{r.fdrNumber}</span>,
    },
    { header: 'Institution', accessor: 'institutionName', sortable: true },
    { header: 'Bank & Branch', accessor: 'bank', render: (r) => `${r.bank} (${r.branch})` },
    {
      header: 'Claimed sum',
      accessor: 'claimedAmount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium">{formatIndianCurrency(r.claimedAmount)}</span>,
    },
    {
      header: 'Bank status',
      accessor: 'status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Digital signature',
      accessor: 'signature',
      render: (r) =>
        r.signature ? (
          <span className="font-mono text-[11px] text-status-green flex items-center gap-1" title={r.signature}>
            <ShieldCheck className="w-3.5 h-3.5" />
            {hashPrefix(r.signature)}...
          </span>
        ) : (
          <span className="text-gray-400 text-xs">Awaiting signature</span>
        ),
    },
    {
      header: 'Simulated action',
      accessor: 'actions',
      render: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            size="sm"
            disabled={isResponding}
            onClick={() => handleAction(r, 'confirm')}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={isResponding}
            onClick={() => {
              setSelectedReq(r);
              setMismatchAmount(String(r.claimedAmount * 0.75));
              setMismatchModalOpen(true);
            }}
          >
            Report mismatch
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isResponding}
            onClick={() => handleAction(r, 'not_found')}
          >
            Not found
          </Button>
        </div>
      ),
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
    <div className="min-h-screen bg-surface-50 p-6 max-w-content mx-auto">
      {/* Prominent clearly labeled banner */}
      <div className="p-4 bg-navy-50 border border-navy-200 rounded mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-navy-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-navy-900">
            <h2 className="font-semibold text-sm">Simulated bank for demonstration</h2>
            <p className="mt-0.5 leading-relaxed text-gray-600">
              This sandbox environment emulates core banking APIs and webhook endpoints for financial
              institutions. Actions taken here generate authentic HMAC cryptographic signatures that
              transmit directly to the AICTE trust ledger.
            </p>
          </div>
        </div>

        <Link to={ROUTES.OFFICER_DASHBOARD}>
          <Button variant="primary" size="sm">
            Return to AICTE portal
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Core banking system simulation"
        description="Incoming electronic verification inquiries awaiting signature"
      />

      <div className="border border-hairline rounded bg-white p-5">
        <DataTable
          columns={columns}
          data={requests}
          emptyMessage="No pending bank verification inquiries."
        />
      </div>

      {/* Mismatch Modal */}
      <Dialog
        isOpen={mismatchModalOpen}
        onClose={() => setMismatchModalOpen(false)}
        title="Report amount discrepancy"
        description={`FDR #${selectedReq?.fdrNumber} • Claimed amount: ${formatIndianCurrency(selectedReq?.claimedAmount)}`}
      >
        <div className="space-y-4">
          <FormField
            label="Actual amount on bank records (in Rupees)"
            required
            helperText="Enter the true figure recorded on the core banking system"
          >
            <Input
              type="number"
              value={mismatchAmount}
              onChange={(e) => setMismatchAmount(e.target.value)}
              placeholder="e.g. 750000"
            />
          </FormField>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-hairline">
            <Button variant="secondary" size="sm" onClick={() => setMismatchModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleAction(selectedReq, 'mismatch', Number(mismatchAmount))}
            >
              Issue signed discrepancy
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
