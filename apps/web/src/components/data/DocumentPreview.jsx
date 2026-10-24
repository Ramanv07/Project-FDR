import React from 'react';
import { FileText, Download, ShieldCheck } from 'lucide-react';
import { formatIndianCurrency, formatDate } from '../../lib/format';

export default function DocumentPreview({
  documentName = 'FDR_Certificate.pdf',
  ocrData = null,
  fdr = null,
}) {
  const data = ocrData || fdr || {};

  return (
    <div className="border border-hairline rounded bg-surface-50 p-4">
      <div className="flex items-center justify-between pb-3 border-b border-surface-200 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-navy-700" />
          <span className="text-xs font-medium text-gray-800">{documentName}</span>
        </div>
        <a
          href={`/mock_fdrs/${documentName}`}
          download={documentName}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-navy-700 hover:text-navy-900 underline"
        >
          <Download className="w-3.5 h-3.5" />
          Download PDF
        </a>
      </div>

      {/* Simulated Scanned Fixed Deposit Certificate Document View */}
      <div className="bg-white border border-surface-300 rounded p-6 shadow-xs font-mono text-xs text-gray-800 space-y-4">
        <div className="text-center border-b border-gray-200 pb-3">
          <p className="font-semibold text-sm tracking-wide text-gray-900 uppercase">
            {data.bank || 'State Bank of India'}
          </p>
          <p className="text-[11px] text-gray-500 font-sans">
            Branch: {data.branch || 'Commercial Branch'}
          </p>
          <p className="text-xs font-medium text-navy-800 mt-1 uppercase tracking-wider font-sans">
            Fixed Deposit Receipt / Term Deposit Advice
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <span className="text-[11px] text-gray-500 font-sans block">FDR Account Number</span>
            <span className="font-semibold text-gray-900">{data.fdrNumber || '31422908764'}</span>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-sans block">Principal Deposit Sum</span>
            <span className="font-semibold text-gray-900">
              {data.amount ? formatIndianCurrency(data.amount) : 'Rs 10,00,000'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-sans block">Date of Issue</span>
            <span className="text-gray-800">{formatDate(data.issueDate) || '15-Jun-2024'}</span>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-sans block">Maturity Date</span>
            <span className="text-gray-800">{formatDate(data.maturityDate) || '15-Jun-2027'}</span>
          </div>
          <div className="col-span-2 border-t border-dashed border-gray-200 pt-2">
            <span className="text-[11px] text-gray-500 font-sans block">Lien Marker Clause</span>
            <span className="text-gray-800">
              Lien marked in favour of: Member Secretary, AICTE New Delhi
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-[11px] font-sans text-gray-500">
          <span className="inline-flex items-center gap-1 text-status-green">
            <ShieldCheck className="w-3.5 h-3.5" />
            Digitally certified copy on AICTE ledger record
          </span>
          <span>Security Ref: AICTE-SEC-2024-901</span>
        </div>
      </div>
    </div>
  );
}
