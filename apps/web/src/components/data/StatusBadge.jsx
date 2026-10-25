import React from 'react';
import { FDR_STATUS } from '../../lib/constants';

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const config = {
    [FDR_STATUS.ACTIVE]: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
      label: 'Active & Lien Marked',
    },
    [FDR_STATUS.VERIFIED]: {
      bg: 'bg-teal-50 text-teal-800 border-teal-200/80',
      dot: 'bg-teal-500',
      label: 'Verified',
    },
    [FDR_STATUS.BANK_CONFIRMED]: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
      label: 'Bank Confirmed (T3)',
    },
    [FDR_STATUS.EXPIRING]: {
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
      dot: 'bg-amber-500 animate-pulse',
      label: 'Expiring Soon',
    },
    [FDR_STATUS.BANK_REQUESTED]: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      dot: 'bg-blue-500 animate-pulse',
      label: 'Bank Inquiry In-Flight',
    },
    [FDR_STATUS.MATURED]: {
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      dot: 'bg-rose-500',
      label: 'Matured / Lapsed',
    },
    [FDR_STATUS.FLAGGED]: {
      bg: 'bg-rose-100 text-rose-900 border-rose-400 font-bold',
      dot: 'bg-rose-600 animate-pulse',
      label: 'Discrepancy Flagged',
    },
    [FDR_STATUS.DRAFT]: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Draft',
    },
    [FDR_STATUS.SUBMITTED]: {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      dot: 'bg-sky-500 animate-pulse',
      label: 'Submitted (T0)',
    },
    [FDR_STATUS.AI_CHECKED]: {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      dot: 'bg-indigo-500',
      label: 'PaddleOCR Scrutinized (T1)',
    },
    [FDR_STATUS.RENEWED]: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Renewed & Chained',
    },
    [FDR_STATUS.RELEASED]: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Lien Released',
    },
    pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500 animate-pulse',
      label: 'Pending Scrutiny',
    },
    officer_approved: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      dot: 'bg-blue-500',
      label: 'Officer Cleared (T2)',
    },
    section_head_approved: {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      dot: 'bg-indigo-500',
      label: 'Section Head Approved',
    },
  }[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold tracking-tight shadow-2xs select-none ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
