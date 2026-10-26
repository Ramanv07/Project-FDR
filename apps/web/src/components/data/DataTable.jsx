import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import EmptyState from '../feedback/EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  onRowClick,
  emptyMessage = 'No records match the current criteria',
  keyField = 'id',
  className = '',
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  const handleHeaderClick = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.accessor) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.accessor);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={`w-full overflow-x-auto border border-slate-200/50 dark:border-transparent rounded-2xl bg-white dark:bg-[#0a1727] shadow-xs ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200/50 dark:border-[rgba(56,136,235,0.08)] bg-slate-50/60 dark:bg-[#0e2035]">
            {columns.map((col) => (
              <th
                key={col.accessor || col.header}
                onClick={() => handleHeaderClick(col)}
                className={`py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8892a4] select-none ${
                  col.sortable ? 'cursor-pointer hover:text-slate-900 dark:hover:text-white' : ''
                } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                style={{ width: col.width }}
              >
                <div
                  className={`inline-flex items-center gap-1.5 ${
                    col.align === 'right' ? 'justify-end w-full' : ''
                  }`}
                >
                  <span>{col.header}</span>
                  {col.sortable && sortKey === col.accessor && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-[#4a8de8]" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-[#4a8de8]" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr
              key={row[keyField] || idx}
              onClick={() => onRowClick && onRowClick(row)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && onRowClick) {
                  e.preventDefault();
                  onRowClick(row);
                }
              }}
              tabIndex={onRowClick ? 0 : undefined}
              className={`border-b border-slate-100 dark:border-[rgba(74,141,232,0.04)] transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#0f1829] focus:bg-slate-50/70 dark:focus:bg-[#0f1829]' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.accessor || col.header}
                  className={`py-3.5 px-4 text-sm text-slate-800 dark:text-slate-200 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
