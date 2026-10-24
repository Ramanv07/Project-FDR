import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { fdrApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import FilterBar from '../../../components/data/FilterBar';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import VerificationLevel from '../../../components/data/VerificationLevel';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/data/Pagination';
import { formatIndianCurrency, formatDate, daysUntil } from '../../../lib/format';
import { BANKS, FDR_STATUS, ROUTES } from '../../../lib/constants';

export default function MyFdrs() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fdrs, setFdrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');
  const [maturityFilter, setMaturityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchFdrs() {
      try {
        const instId = user?.institutionId || 'inst-01';
        const data = await fdrApi.getFdrs({ institutionId: instId });
        setFdrs(data);
      } finally {
        setLoading(false);
      }
    }
    fetchFdrs();
  }, [user]);

  const filteredFdrs = useMemo(() => {
    return fdrs.filter((fdr) => {
      if (statusFilter !== 'all' && fdr.status !== statusFilter) return false;
      if (bankFilter !== 'all' && fdr.bank !== bankFilter) return false;

      if (maturityFilter === 'expiring_30') {
        const d = daysUntil(fdr.maturityDate);
        if (d < 0 || d > 30) return false;
      } else if (maturityFilter === 'expiring_60') {
        const d = daysUntil(fdr.maturityDate);
        if (d < 0 || d > 60) return false;
      } else if (maturityFilter === 'matured') {
        if (daysUntil(fdr.maturityDate) >= 0) return false;
      }

      if (search) {
        const q = search.toLowerCase();
        return (
          fdr.fdrNumber.toLowerCase().includes(q) ||
          fdr.bank.toLowerCase().includes(q) ||
          (fdr.programYear && fdr.programYear.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [fdrs, search, statusFilter, bankFilter, maturityFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFdrs.slice(start, start + pageSize);
  }, [filteredFdrs, currentPage]);

  const columns = [
    {
      header: 'FDR number',
      accessor: 'fdrNumber',
      sortable: true,
      render: (r) => (
        <span className="font-mono font-medium text-navy-800">{r.fdrNumber}</span>
      ),
    },
    { header: 'Bank', accessor: 'bank', sortable: true },
    { header: 'Branch', accessor: 'branch' },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium">{formatIndianCurrency(r.amount)}</span>,
    },
    {
      header: 'Issue date',
      accessor: 'issueDate',
      sortable: true,
      render: (r) => formatDate(r.issueDate),
    },
    {
      header: 'Maturity date',
      accessor: 'maturityDate',
      sortable: true,
      render: (r) => formatDate(r.maturityDate),
    },
    {
      header: 'Verification',
      accessor: 'trustLevel',
      render: (r) => <VerificationLevel level={r.trustLevel} />,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Institution FDR register"
        description="All security deposits recorded under AICTE custody for this institute"
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.SUBMIT_FDR)}
          >
            Submit new FDR
          </Button>
        }
      />

      <div className="border border-hairline rounded bg-white p-5">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search FDR number or program..."
          onClear={() => {
            setSearch('');
            setStatusFilter('all');
            setBankFilter('all');
            setMaturityFilter('all');
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
                { value: FDR_STATUS.FLAGGED, label: 'Flagged' },
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
            {
              key: 'maturity',
              value: maturityFilter,
              onChange: (v) => {
                setMaturityFilter(v);
                setCurrentPage(1);
              },
              options: [
                { value: 'all', label: 'All maturities' },
                { value: 'expiring_30', label: 'Expiring in 30 days' },
                { value: 'expiring_60', label: 'Expiring in 60 days' },
                { value: 'matured', label: 'Already matured' },
              ],
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={paginatedData}
          onRowClick={(row) => navigate(`/institution/fdr/${row.id}`)}
          emptyMessage="No fixed deposits match the selected filter criteria."
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
