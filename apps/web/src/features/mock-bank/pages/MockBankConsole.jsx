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
      <div className="p-5 bg-gradient-to-r from-blue-50/80 via-slate-50 to-amber-50/50 border border-slate-200 rounded-2xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-950 font-display">
                RBI Scheduled Bank / NeSL Simulator Gateway
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Sandbox CBS
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-2xl">
              Emulates Core Banking System (CBS) APIs and NeSL electronic guarantee reconciliation.
              Confirming or reporting discrepancies issues authentic HMAC cryptographic signatures directly appended to the AICTE trust ledger.
            </p>
          </div>
        </div>

        <Link to={ROUTES.OFFICER_DASHBOARD} className="flex-shrink-0">
          <Button variant="primary" size="sm">
            ← Return to AICTE Portal
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Inter-Bank Verification Gateway"
        description="Incoming electronic lien verification inquiries dispatched by AICTE scrutiny officers"
      />

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-xs">
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
