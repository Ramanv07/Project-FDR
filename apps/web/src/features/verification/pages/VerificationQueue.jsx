import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import FilterBar from '../../../components/data/FilterBar';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import VerificationLevel from '../../../components/data/VerificationLevel';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency, formatDate } from '../../../lib/format';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VerificationQueue() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await verificationApi.getQueue();
        setQueue(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      if (typeFilter === 'discrepancy' && !item.discrepancy) return false;
      if (typeFilter === 'pending' && !item.status.startsWith('pending')) return false;

      if (search) {
        const q = search.toLowerCase();
        return (
          item.fdrNumber.toLowerCase().includes(q) ||
          item.institutionName.toLowerCase().includes(q) ||
          item.bank.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [queue, search, typeFilter]);

  const columns = [
    {
      header: 'FDR number',
      accessor: 'fdrNumber',
      sortable: true,
      render: (r) => <span className="font-mono font-medium text-navy-800 dark:text-blue-400">{r.fdrNumber}</span>,
    },
    { header: 'Institution', accessor: 'institutionName', sortable: true },
    { header: 'Bank', accessor: 'bank', sortable: true },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium">{formatIndianCurrency(r.amount)}</span>,
    },
    {
      header: 'Verification stage',
      accessor: 'trustLevel',
      render: (r) => <VerificationLevel level={r.trustLevel} />,
    },
    {
      header: 'Discrepancy flag',
      accessor: 'discrepancy',
      render: (r) =>
        r.discrepancy ? (
          <span className="inline-flex items-center gap-1 text-xs text-status-red font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {r.discrepancyNote || 'Discrepancy detected'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-status-green">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Clear
          </span>
        ),
    },
    {
      header: 'Queue status',
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
        title="Verification queue"
        description="Pending bank confirmations and flagged records requiring officer scrutiny"
      />

      <div className="border border-hairline dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0f172a] p-5 shadow-xs">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search FDR number or institution..."
          onClear={() => {
            setSearch('');
            setTypeFilter('all');
          }}
          filters={[
            {
              key: 'type',
              value: typeFilter,
              onChange: setTypeFilter,
              options: [
                { value: 'all', label: 'All verification items' },
                { value: 'discrepancy', label: 'Flagged discrepancies only' },
                { value: 'pending', label: 'Pending checks only' },
              ],
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={filteredQueue}
          onRowClick={(row) => navigate(`/officer/fdr/${row.fdrId}/review`)}
          emptyMessage="No items in the verification queue matching this filter."
        />
      </div>
    </div>
  );
}
