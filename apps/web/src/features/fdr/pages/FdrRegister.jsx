import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fdrApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import FilterBar from '../../../components/data/FilterBar';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import VerificationLevel from '../../../components/data/VerificationLevel';
import HealthScore from '../../../components/data/HealthScore';
import Pagination from '../../../components/data/Pagination';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency, formatDate } from '../../../lib/format';
import { calculateHealthScore } from '../../../lib/healthScore';
import { BANKS, FDR_STATUS } from '../../../lib/constants';

export default function FdrRegister() {
  const navigate = useNavigate();
  const [fdrs, setFdrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    async function fetchFdrs() {
      try {
        const data = await fdrApi.getFdrs();
        setFdrs(data);
      } finally {
        setLoading(false);
      }
    }
    fetchFdrs();
  }, []);

  const filteredFdrs = useMemo(() => {
    return fdrs.filter((fdr) => {
      if (statusFilter !== 'all' && fdr.status !== statusFilter) return false;
      if (bankFilter !== 'all' && fdr.bank !== bankFilter) return false;

      if (search) {
        const q = search.toLowerCase();
        return (
          fdr.fdrNumber.toLowerCase().includes(q) ||
          fdr.institutionName?.toLowerCase().includes(q) ||
          fdr.bank.toLowerCase().includes(q) ||
          fdr.branch?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [fdrs, search, statusFilter, bankFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFdrs.slice(start, start + pageSize);
  }, [filteredFdrs, currentPage]);

  const columns = [
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
      header: 'Maturity date',
      accessor: 'maturityDate',
      sortable: true,
      render: (r) => formatDate(r.maturityDate),
    },
    {
      header: 'Trust level',
      accessor: 'trustLevel',
      render: (r) => <VerificationLevel level={r.trustLevel} />,
    },
    {
      header: 'Risk',
      accessor: 'healthScore',
      render: (r) => {
        const { score, reasons } = calculateHealthScore(r);
        return <HealthScore score={score} reasons={reasons} fdrNumber={r.fdrNumber} />;
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
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
        title="National FDR register"
        description="Comprehensive central ledger of all fixed deposit receipts across all registered technical institutions"
      />

      <div className="border border-hairline rounded bg-white p-5">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search FDR number, institution name, or bank..."
          onClear={() => {
            setSearch('');
            setStatusFilter('all');
            setBankFilter('all');
            setCurrentPage(1);
          }}
          filters={[
            {
              key: 'status',
              value: statusFilter,
              onChange: (v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              },
              options: [
                { value: 'all', label: 'All statuses' },
                { value: FDR_STATUS.ACTIVE, label: 'Active' },
                { value: FDR_STATUS.SUBMITTED, label: 'Submitted' },
                { value: FDR_STATUS.EXPIRING, label: 'Expiring soon' },
                { value: FDR_STATUS.MATURED, label: 'Matured' },
                { value: FDR_STATUS.FLAGGED, label: 'Flagged discrepancy' },
                { value: FDR_STATUS.RELEASED, label: 'Released' },
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
          emptyMessage="No fixed deposit records match the query."
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredFdrs.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
