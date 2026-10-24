import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { riskApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import FilterBar from '../../../components/data/FilterBar';
import DataTable from '../../../components/data/DataTable';
import HealthScore from '../../../components/data/HealthScore';
import StatusBadge from '../../../components/data/StatusBadge';
import Pagination from '../../../components/data/Pagination';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency, formatDate } from '../../../lib/format';
import { BANKS } from '../../../lib/constants';

export default function RiskQueue() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchQueue() {
      try {
        const data = await riskApi.getRiskQueue();
        setQueue(data);
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, []);

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      if (bankFilter !== 'all' && item.bank !== bankFilter) return false;

      if (scoreFilter === 'critical') {
        if (item.healthScore >= 40) return false;
      } else if (scoreFilter === 'warning') {
        if (item.healthScore < 40 || item.healthScore >= 70) return false;
      } else if (scoreFilter === 'good') {
        if (item.healthScore < 70) return false;
      }

      if (search) {
        const q = search.toLowerCase();
        return (
          item.fdrNumber.toLowerCase().includes(q) ||
          item.institutionName?.toLowerCase().includes(q) ||
          item.bank.toLowerCase().includes(q) ||
          item.reasonSummary?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [queue, search, scoreFilter, bankFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQueue.slice(start, start + pageSize);
  }, [filteredQueue, currentPage]);

  const columns = [
    {
      header: 'Risk score',
      accessor: 'healthScore',
      sortable: true,
      width: '130px',
      render: (r) => (
        <HealthScore score={r.healthScore} reasons={r.riskReasons} fdrNumber={r.fdrNumber} />
      ),
    },
    {
      header: 'FDR number',
      accessor: 'fdrNumber',
      sortable: true,
      render: (r) => <span className="font-mono font-medium text-navy-800">{r.fdrNumber}</span>,
    },
    { header: 'Institution', accessor: 'institutionName', sortable: true },
    { header: 'Bank', accessor: 'bank', sortable: true },
    {
      header: 'Deposit sum',
      accessor: 'amount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium">{formatIndianCurrency(r.amount)}</span>,
    },
    {
      header: 'Maturity',
      accessor: 'maturityDate',
      sortable: true,
      render: (r) => formatDate(r.maturityDate),
    },
    {
      header: 'Reasons in words',
      accessor: 'reasonSummary',
      render: (r) => (
        <span className="text-xs text-status-red block max-w-md leading-relaxed">
          {r.riskReasons && r.riskReasons.length > 0
            ? r.riskReasons.join('; ')
            : 'No anomalies'}
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
        title="Risk scrutiny queue"
        description="Prioritized list of fixed deposits sorted by lowest health score (highest risk first)"
      />

      <div className="border border-hairline rounded bg-white p-5">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search FDR, institution or risk reason..."
          onClear={() => {
            setSearch('');
            setScoreFilter('all');
            setBankFilter('all');
            setCurrentPage(1);
          }}
          filters={[
            {
              key: 'score',
              value: scoreFilter,
              onChange: (v) => {
                setScoreFilter(v);
                setCurrentPage(1);
              },
              options: [
                { value: 'all', label: 'All risk levels' },
                { value: 'critical', label: 'Critical risk (< 40)' },
                { value: 'warning', label: 'Moderate risk (40-69)' },
                { value: 'good', label: 'Low risk (70-100)' },
              ],
            },
            {
              key: 'bank',
              value: bankFilter,
              onChange: (v) => {
                setBankFilter(v);
                setCurrentPage(1);
              },
              options: [
                { value: 'all', label: 'All banks' },
                ...BANKS.map((b) => ({ value: b, label: b })),
              ],
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={paginatedData}
          onRowClick={(row) => navigate(`/officer/fdr/${row.id}/review`)}
          emptyMessage="No fixed deposit records meet the selected risk filter."
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredQueue.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
