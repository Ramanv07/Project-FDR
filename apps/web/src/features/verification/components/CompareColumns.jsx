import React from 'react';
import { formatIndianCurrency, formatDate } from '../../../lib/format';
import { AlertCircle } from 'lucide-react';

export default function CompareColumns({ submitted = {}, ocr = {}, bank = {} }) {
  const fields = [
    {
      key: 'fdrNumber',
      label: 'FDR number',
      format: (val) => <span className="font-mono font-medium">{val || '—'}</span>,
    },
    {
      key: 'amount',
      label: 'Deposit amount',
      format: (val) => (val ? formatIndianCurrency(val) : '—'),
    },
    {
      key: 'bank',
      label: 'Issuing bank',
      format: (val) => val || '—',
    },
    {
      key: 'branch',
      label: 'Branch name',
      format: (val) => val || '—',
    },
    {
      key: 'issueDate',
      label: 'Date of issue',
      format: (val) => (val ? formatDate(val) : '—'),
    },
    {
      key: 'maturityDate',
      label: 'Maturity date',
      format: (val) => (val ? formatDate(val) : '—'),
    },
    {
      key: 'lienHolder',
      label: 'Lien marker clause',
      format: (val) => val || 'Member Secretary, AICTE New Delhi',
    },
  ];

  return (
    <div className="border border-hairline dark:border-slate-800 rounded-xl bg-white dark:bg-[#0f172a] overflow-hidden shadow-xs">
      <div className="grid grid-cols-12 bg-surface-100 dark:bg-[#0c1424] border-b border-hairline dark:border-slate-800 text-table font-semibold text-gray-700 dark:text-slate-300 py-2.5 px-4">
        <div className="col-span-3">Field</div>
        <div className="col-span-3">1. Submitted by institution</div>
        <div className="col-span-3">2. Read from document (OCR)</div>
        <div className="col-span-3">3. Bank response</div>
      </div>

      <div className="divide-y divide-surface-200 dark:divide-slate-800/80 text-table">
        {fields.map((f) => {
          const valSub = submitted[f.key];
          const valOcr = ocr[f.key];
          const valBank = bank[f.key];

          // Check if there is an amount or data mismatch
          const isAmountMismatch =
            f.key === 'amount' &&
            valBank != null &&
            Number(valSub) !== Number(valBank);

          const isNumberMismatch =
            f.key === 'fdrNumber' &&
            valBank != null &&
            String(valSub).trim() !== String(valBank).trim();

          const hasMismatch = isAmountMismatch || isNumberMismatch;

          return (
            <div
              key={f.key}
              className={`grid grid-cols-12 items-center py-2.5 px-4 transition-colors ${
                hasMismatch
                  ? 'bg-red-50/60 dark:bg-red-950/25'
                  : 'hover:bg-slate-50/60 dark:hover:bg-[#141f36]/40'
              }`}
            >
              <div className="col-span-3 font-medium text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                <span>{f.label}</span>
                {hasMismatch && (
                  <AlertCircle className="w-3.5 h-3.5 text-status-red flex-shrink-0" />
                )}
              </div>

              {/* Column 1: Submitted by institution */}
              <div className="col-span-3 text-gray-900 dark:text-slate-100 pr-2 font-medium">
                {f.format(valSub)}
              </div>

              {/* Column 2: Read from OCR document */}
              <div className="col-span-3 text-gray-800 dark:text-slate-200 pr-2">
                {f.format(valOcr)}
              </div>

              {/* Column 3: Bank Response (Highlighted red if mismatch) */}
              <div
                className={`col-span-3 py-0.5 px-2 rounded ${
                  hasMismatch
                    ? 'bg-red-100 dark:bg-red-950/60 text-status-red font-semibold border border-red-200 dark:border-red-900/60'
                    : 'text-gray-900 dark:text-slate-100 font-medium'
                }`}
              >
                {f.format(valBank)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
