import React, { useState, useEffect } from 'react';
import { auditApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import DataTable from '../../../components/data/DataTable';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { useToast } from '../../../components/ui/Toast';
import { formatDate, hashPrefix } from '../../../lib/format';
import { ShieldCheck, AlertOctagon, RefreshCw } from 'lucide-react';

export default function AuditLedger() {
  const { addToast } = useToast();
  const [entries, setEntries] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchLedger = async () => {
    try {
      const data = await auditApi.getLedger();
      setEntries(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const result = await auditApi.verifyIntegrity();
      setVerificationStatus(result);
      if (result.valid) {
        addToast(result.message, 'success');
      } else {
        addToast(result.message, 'error');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTamper = async () => {
    try {
      await auditApi.tamperChain();
      addToast('Simulated tampering executed on ledger entry #3. Click Verify Integrity.', 'info');
      setVerificationStatus(null);
      await fetchLedger();
    } catch (err) {
      addToast(err.message || 'Tamper failed', 'error');
    }
  };

  const handleRestore = async () => {
    try {
      await auditApi.restoreChain();
      addToast('Audit chain restored to valid state.', 'success');
      setVerificationStatus(null);
      await fetchLedger();
    } catch (err) {
      addToast(err.message || 'Restore failed', 'error');
    }
  };

  const columns = [
    {
      header: 'Entry ID',
      accessor: 'id',
      width: '90px',
      render: (r) => <span className="font-mono text-gray-500">{r.id}</span>,
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      width: '130px',
      render: (r) => formatDate(r.timestamp),
    },
    {
      header: 'Initiator / User',
      accessor: 'userName',
      render: (r) => <span className="font-medium text-gray-900">{r.userName}</span>,
    },
    {
      header: 'Action performed',
      accessor: 'action',
      render: (r) => (
        <span className="font-mono text-xs px-1.5 py-0.5 bg-surface-200 text-gray-800 rounded">
          {r.action}
        </span>
      ),
    },
    {
      header: 'Record / Details',
      accessor: 'details',
      render: (r) => (
        <span className={r.details?.includes('[TAMPERED]') ? 'text-status-red font-semibold' : 'text-gray-700'}>
          {r.details}
        </span>
      ),
    },
    {
      header: 'Prev hash',
      accessor: 'previousHash',
      render: (r) => (
        <span className="font-mono text-[11px] text-gray-400" title={r.previousHash}>
          {hashPrefix(r.previousHash)}...
        </span>
      ),
    },
    {
      header: 'Entry hash (SHA-256)',
      accessor: 'hash',
      render: (r) => (
        <span className="font-mono text-[11px] font-medium text-navy-800" title={r.hash}>
          {hashPrefix(r.hash)}...
        </span>
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
    <div>
      <PageHeader
        title="Audit ledger & cryptographic integrity"
        description="Immutable SHA-256 hash-chained log of every regulatory action, verification, and deposit state transition"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleTamper} title="Simulate ledger data tampering for demo">
              Tamper entry (Demo)
            </Button>
            <Button variant="secondary" size="sm" onClick={handleRestore} title="Restore cryptographic chain">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Restore
            </Button>
            <Button variant="primary" size="sm" onClick={handleVerify} disabled={isVerifying}>
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              {isVerifying ? 'Verifying...' : 'Verify integrity'}
            </Button>
          </div>
        }
      />

      {/* Verification Status Banner */}
      {verificationStatus && (
        <div
          className={`p-4 rounded border mb-6 flex items-start gap-3 ${
            verificationStatus.valid
              ? 'bg-green-50 border-status-green text-status-green'
              : 'bg-red-50 border-status-red text-status-red'
          }`}
        >
          {verificationStatus.valid ? (
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <p className="font-semibold text-sm">
              {verificationStatus.valid ? 'Cryptographic audit chain intact' : 'Cryptographic integrity breach detected!'}
            </p>
            <p className="mt-0.5 leading-relaxed">{verificationStatus.message}</p>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      <div className="border border-hairline dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0f172a] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-medium text-gray-800 dark:text-slate-200">
            Hash chain records ({entries.length} entries)
          </span>
          <span className="text-gray-400">Algorithm: SHA-256 with Web Crypto HMAC verification</span>
        </div>

        <DataTable
          columns={columns}
          data={entries}
          emptyMessage="No audit ledger records recorded."
        />
      </div>
    </div>
  );
}
