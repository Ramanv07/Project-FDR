import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { institutionApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import FilterBar from '../../../components/data/FilterBar';
import DataTable from '../../../components/data/DataTable';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency } from '../../../lib/format';
import { STATES } from '../../../lib/constants';

export default function InstitutionList() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await institutionApi.getInstitutions();
        setInstitutions(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return institutions.filter((inst) => {
      if (stateFilter !== 'all' && inst.state !== stateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          inst.name.toLowerCase().includes(q) ||
          inst.aicteId.toLowerCase().includes(q) ||
          inst.contactPerson?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [institutions, search, stateFilter]);

  const columns = [
    {
      header: 'AICTE ID',
      accessor: 'aicteId',
      sortable: true,
      render: (r) => <span className="font-mono font-medium text-navy-800">{r.aicteId}</span>,
    },
    { header: 'Institution name', accessor: 'name', sortable: true },
    { header: 'State', accessor: 'state', sortable: true },
    {
      header: 'FDRs on record',
      accessor: 'fdrCount',
      sortable: true,
      align: 'center',
      render: (r) => <span className="font-semibold">{r.fdrCount}</span>,
    },
    {
      header: 'Total deposits',
      accessor: 'totalAmount',
      sortable: true,
      align: 'right',
      render: (r) => <span className="font-medium">{formatIndianCurrency(r.totalAmount)}</span>,
    },
    {
      header: 'Discrepancy flags',
      accessor: 'flaggedCount',
      sortable: true,
      align: 'center',
      render: (r) =>
        r.flaggedCount > 0 ? (
          <span className="text-xs text-status-red font-medium">
            {r.flaggedCount} flagged
          </span>
        ) : (
          <span className="text-xs text-status-green">Clear</span>
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
        title="Technical institutions directory"
        description="Registry of approved colleges maintaining security deposits with AICTE"
      />

      <div className="border border-hairline rounded bg-white p-5">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search institution name or AICTE ID..."
          onClear={() => {
            setSearch('');
            setStateFilter('all');
          }}
          filters={[
            {
              key: 'state',
              value: stateFilter,
              onChange: setStateFilter,
              options: [
                { value: 'all', label: 'All states' },
                ...STATES.map((s) => ({ value: s, label: s })),
              ],
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => navigate(`/officer/institution/${row.id}`)}
          emptyMessage="No institutions matched your search."
        />
      </div>
    </div>
  );
}
