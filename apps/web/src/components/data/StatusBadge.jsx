import React from 'react';
import { FDR_STATUS } from '../../lib/constants';

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const config = {
    [FDR_STATUS.ACTIVE]: { dot: 'bg-status-green', text: 'text-status-green', label: 'Active' },
    [FDR_STATUS.VERIFIED]: { dot: 'bg-status-green', text: 'text-status-green', label: 'Verified' },
    [FDR_STATUS.BANK_CONFIRMED]: { dot: 'bg-status-green', text: 'text-status-green', label: 'Bank confirmed' },
    [FDR_STATUS.EXPIRING]: { dot: 'bg-status-amber', text: 'text-status-amber', label: 'Expiring soon' },
    [FDR_STATUS.BANK_REQUESTED]: { dot: 'bg-status-amber', text: 'text-status-amber', label: 'Bank requested' },
    [FDR_STATUS.MATURED]: { dot: 'bg-status-red', text: 'text-status-red', label: 'Matured' },
    [FDR_STATUS.FLAGGED]: { dot: 'bg-status-red', text: 'text-status-red', label: 'Flagged discrepancy' },
    [FDR_STATUS.DRAFT]: { dot: 'bg-status-grey', text: 'text-status-grey', label: 'Draft' },
    [FDR_STATUS.SUBMITTED]: { dot: 'bg-navy-600', text: 'text-navy-700', label: 'Submitted' },
    [FDR_STATUS.AI_CHECKED]: { dot: 'bg-navy-600', text: 'text-navy-700', label: 'AI checked' },
    [FDR_STATUS.RENEWED]: { dot: 'bg-status-grey', text: 'text-status-grey', label: 'Renewed' },
    [FDR_STATUS.RELEASED]: { dot: 'bg-status-grey', text: 'text-status-grey', label: 'Released' },
    pending: { dot: 'bg-status-amber', text: 'text-status-amber', label: 'Pending' },
    officer_approved: { dot: 'bg-navy-600', text: 'text-navy-700', label: 'Officer approved' },
    section_head_approved: { dot: 'bg-navy-600', text: 'text-navy-700', label: 'Section Head approved' },
  }[status] || { dot: 'bg-status-grey', text: 'text-status-grey', label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
