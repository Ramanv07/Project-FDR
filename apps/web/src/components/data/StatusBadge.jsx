import React from 'react';
import { FDR_STATUS } from '../../lib/constants';

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const config = {
    [FDR_STATUS.ACTIVE]: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600', label: 'Active' },
    [FDR_STATUS.VERIFIED]: { bg: 'bg-teal-50 text-teal-800 border-teal-300', dot: 'bg-teal-600', label: 'Verified' },
    [FDR_STATUS.BANK_CONFIRMED]: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600', label: 'Bank Confirmed' },
    [FDR_STATUS.EXPIRING]: { bg: 'bg-amber-50 text-amber-800 border-amber-300', dot: 'bg-amber-600', label: 'Expiring Soon' },
    [FDR_STATUS.BANK_REQUESTED]: { bg: 'bg-blue-50 text-blue-800 border-blue-300', dot: 'bg-blue-600', label: 'Bank Verification In-Flight' },
    [FDR_STATUS.MATURED]: { bg: 'bg-red-50 text-red-800 border-red-300', dot: 'bg-red-600', label: 'Matured' },
    [FDR_STATUS.FLAGGED]: { bg: 'bg-red-50 text-red-800 border-red-300 font-semibold', dot: 'bg-red-600', label: 'Discrepancy Flagged' },
    [FDR_STATUS.DRAFT]: { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', label: 'Draft' },
    [FDR_STATUS.SUBMITTED]: { bg: 'bg-sky-50 text-sky-800 border-sky-300', dot: 'bg-sky-600', label: 'Submitted (T0)' },
    [FDR_STATUS.AI_CHECKED]: { bg: 'bg-indigo-50 text-indigo-800 border-indigo-300', dot: 'bg-indigo-600', label: 'OCR Checked (T1)' },
    [FDR_STATUS.RENEWED]: { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', label: 'Renewed' },
    [FDR_STATUS.RELEASED]: { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', label: 'Released' },
    pending: { bg: 'bg-amber-50 text-amber-800 border-amber-300', dot: 'bg-amber-600', label: 'Pending' },
    officer_approved: { bg: 'bg-sky-50 text-sky-800 border-sky-300', dot: 'bg-sky-600', label: 'Officer Approved (T2)' },
    section_head_approved: { bg: 'bg-indigo-50 text-indigo-800 border-indigo-300', dot: 'bg-indigo-600', label: 'Section Head Approved' },
  }[status] || { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium ${config.bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
