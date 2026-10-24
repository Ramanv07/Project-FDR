import React, { useState, useEffect } from 'react';
import { reportsApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import DataTable from '../../../components/data/DataTable';
import StatusBadge from '../../../components/data/StatusBadge';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { formatIndianCurrency, formatDate } from '../../../lib/format';
import { BANKS } from '../../../lib/constants';
import { Download } from 'lucide-react';

export default function Reports() {
  const [reportType, setReportType] = useState('upcoming_maturities');
  const [bankFilter, setBankFilter] = useState('all');
  const [daysFilter, setDaysFilter] = useState('60');
  const [reportResult, setReportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await reportsApi.generateReport({
        reportType,
        bank: bankFilter,
        days: daysFilter,
      });
      setReportResult(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, bankFilter, daysFilter]);

  const handleExportCSV = () => {
    if (!reportResult?.records || reportResult.records.length === 0) return;

    const headers = ['FDR Number', 'Institution', 'Bank', 'Amount', 'Issue Date', 'Maturity Date', 'Status'];
    const rows = reportResult.records.map((r) => [
      r.fdrNumber,
      `"${r.institutionName || ''}"`,
      `"${r.bank || ''}"`,
      r.amount,
      r.issueDate,
      r.maturityDate,
      r.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AICTE_FDR_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      header: 'Amount',
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
      header: 'Status',
      accessor: 'status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Statutory compliance reports"
        description="Generate audit extracts and download official spreadsheets"
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            disabled={!reportResult?.records?.length}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export CSV
          </Button>
        }
      />

      {/* Report Configuration Bar */}
      <div className="border border-hairline rounded bg-white p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Report type</label>
          <Select
            value={reportType}
            onChange={setReportType}
            options={[
              { value: 'upcoming_maturities', label: 'Upcoming maturities' },
              { value: 'pending_verifications', label: 'Pending verifications' },
              { value: 'missing_documents', label: 'Missing document certificates' },
              { value: 'discrepancies', label: 'Flagged discrepancies' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Bank filter</label>
          <Select
            value={bankFilter}
            onChange={setBankFilter}
            options={[
              { value: 'all', label: 'All banks' },
              ...BANKS.map((b) => ({ value: b, label: b })),
            ]}
          />
        </div>

        {reportType === 'upcoming_maturities' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Maturity horizon</label>
            <Select
              value={daysFilter}
              onChange={setDaysFilter}
              options={[
                { value: '30', label: 'Next 30 days' },
                { value: '60', label: 'Next 60 days' },
                { value: '90', label: 'Next 90 days' },
                { value: '180', label: 'Next 6 months' },
              ]}
            />
          </div>
        )}

        <div>
          <Button variant="secondary" size="md" className="w-full" onClick={fetchReport}>
            Refresh extract
          </Button>
        </div>
      </div>

      {/* Table Preview */}
      <div className="border border-hairline rounded bg-white p-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-medium text-gray-800">
            Preview: {reportResult?.recordCount || 0} records extracted
          </span>
          <span className="text-gray-400">
            Generated: {reportResult?.generatedAt ? formatDate(reportResult.generatedAt) : '—'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Spinner />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={reportResult?.records || []}
            emptyMessage="No records matched the selected report parameters."
          />
        )}
      </div>
    </div>
  );
}
