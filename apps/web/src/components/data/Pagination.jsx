import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 ${className}`}>
      <div>
        Showing <span className="font-semibold text-gray-800 dark:text-slate-200">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-800 dark:text-slate-200">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-800 dark:text-slate-200">{totalItems}</span> records
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded border border-hairline dark:border-slate-700 bg-white dark:bg-[#0c1424] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-slate-400" />
        </button>
        <span className="px-2 font-medium text-gray-800 dark:text-slate-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded border border-hairline dark:border-slate-700 bg-white dark:bg-[#0c1424] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
}
