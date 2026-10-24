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
    <div className={`w-full overflow-x-auto border border-hairline rounded bg-white ${className}`}>
      <table className="w-full text-left border-collapse table-compact">
        <thead>
          <tr className="border-b border-hairline bg-surface-100">
            {columns.map((col) => (
              <th
                key={col.accessor || col.header}
                onClick={() => handleHeaderClick(col)}
                className={`text-table font-medium text-gray-600 select-none ${
                  col.sortable ? 'cursor-pointer hover:text-gray-900' : ''
                } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                style={{ width: col.width }}
              >
                <div
                  className={`inline-flex items-center gap-1 ${
                    col.align === 'right' ? 'justify-end w-full' : ''
                  }`}
                >
                  <span>{col.header}</span>
                  {col.sortable && sortKey === col.accessor && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-navy-700" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-navy-700" />
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
              className={`border-b border-surface-200 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-surface-100 focus:bg-surface-100' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.accessor || col.header}
                  className={`text-table text-gray-800 ${
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
