import React from 'react';
import { Search, X } from 'lucide-react';

export default function FilterBar({
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filters = [],
  onClear,
  children,
}) {
  const hasActiveFilters = Boolean(
    searchValue || filters.some((f) => f.value && f.value !== 'all'),
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        {onSearchChange && (
          <div className="relative min-w-[200px] max-w-xs flex-1">
            <Search className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-hairline dark:border-slate-700 bg-white dark:bg-[#0c1424] text-gray-900 dark:text-slate-100 focus-visible:outline-navy-700 dark:focus-visible:outline-blue-500 placeholder-gray-400 dark:placeholder-slate-500 shadow-2xs transition-colors"
            />
          </div>
        )}

        {filters.map((f) => (
          <select
            key={f.key}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="text-xs rounded-lg border border-hairline dark:border-slate-700 bg-white dark:bg-[#0c1424] px-2.5 py-1.5 focus-visible:outline-navy-700 dark:focus-visible:outline-blue-500 text-gray-700 dark:text-slate-200 shadow-2xs transition-colors"
          >
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0c1424] text-gray-900 dark:text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {hasActiveFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 px-2 py-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
