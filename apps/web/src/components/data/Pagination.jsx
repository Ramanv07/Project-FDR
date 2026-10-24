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
    <div className={`flex items-center justify-between text-xs text-gray-500 pt-3 ${className}`}>
      <div>
        Showing <span className="font-medium text-gray-800">{startItem}</span> to{' '}
        <span className="font-medium text-gray-800">{endItem}</span> of{' '}
        <span className="font-medium text-gray-800">{totalItems}</span> records
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1 rounded border border-hairline disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-100"
          title="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <span className="px-2 font-medium text-gray-800">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1 rounded border border-hairline disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-100"
          title="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
