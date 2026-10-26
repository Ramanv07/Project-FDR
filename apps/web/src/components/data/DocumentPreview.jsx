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
    <div className="border border-hairline dark:border-slate-800 rounded bg-surface-50 dark:bg-[#0c1424] p-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-surface-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-navy-700 dark:text-blue-400" />
          <span className="text-xs font-medium text-gray-800 dark:text-slate-200">{documentName}</span>
        </div>
        <a
          href={`/mock_fdrs/${documentName}`}
          download={documentName}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-navy-700 dark:text-blue-400 hover:text-navy-900 dark:hover:text-blue-300 underline"
        >
          <Download className="w-3.5 h-3.5" />
          Download PDF
        </a>
      </div>

      {/* Authentic Scanned Fixed Deposit Certificate Document View */}
      <div className="bg-[#fffdfa] dark:bg-[#0f172a] border-2 border-[#1F3A5F]/20 dark:border-blue-900/40 rounded p-6 shadow-sm text-xs text-gray-800 dark:text-slate-200 space-y-4 relative overflow-hidden transition-colors">
        {/* Subtle Bank Watermark Stamp */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] pointer-events-none opacity-[0.06] select-none text-center">
          <p className="text-5xl font-black uppercase tracking-widest text-[#1F3A5F] dark:text-blue-400">AICTE LIEN</p>
          <p className="text-xl font-bold tracking-wider mt-1">SECURITY DEPOSIT</p>
        </div>

        <div className="text-center border-b-2 border-slate-200 dark:border-slate-800 pb-3">
          <div className="inline-block px-3 py-0.5 mb-1 text-[10px] uppercase font-bold tracking-wider bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300">
            Official Bank Advice
          </div>
          <p className="font-bold text-base tracking-wide text-slate-900 dark:text-white uppercase">
            {data.bank || 'State Bank of India'}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Branch: {data.branch || 'Commercial Branch'}
          </p>
          <p className="text-xs font-semibold text-[#1F3A5F] dark:text-blue-400 mt-1 uppercase tracking-wider">
            Fixed Deposit Receipt / Term Deposit Advice
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5 pt-1">
          <div className="bg-white dark:bg-[#141f36] p-2 border border-slate-200 dark:border-slate-800 rounded">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">FDR Certificate Number</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{data.fdrNumber || '31422908764'}</span>
          </div>
          <div className="bg-white dark:bg-[#141f36] p-2 border border-slate-200 dark:border-slate-800 rounded">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Principal Deposit Sum</span>
            <span className="font-bold text-slate-900 dark:text-white text-xs">
              {data.amount ? formatIndianCurrency(data.amount) : 'Rs 10,00,000'}
            </span>
          </div>
          <div className="bg-white dark:bg-[#141f36] p-2 border border-slate-200 dark:border-slate-800 rounded">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Date of Issue</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{formatDate(data.issueDate) || '15-Jun-2024'}</span>
          </div>
          <div className="bg-white dark:bg-[#141f36] p-2 border border-slate-200 dark:border-slate-800 rounded">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Maturity Date</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{formatDate(data.maturityDate) || '15-Jun-2027'}</span>
          </div>
          <div className="col-span-2 bg-blue-50/50 dark:bg-blue-950/40 p-2 border border-blue-200 dark:border-blue-900/60 rounded">
            <span className="text-[10px] text-blue-900 dark:text-blue-300 uppercase font-bold block">Statutory Lien Endorsement</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium text-xs">
              Lien marked in favour of: <strong>Member Secretary, AICTE New Delhi</strong>
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Digitally certified copy on AICTE ledger record
          </span>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">Ref: AICTE-SEC-2024-901</span>
        </div>
      </div>
    </div>
  );
}
