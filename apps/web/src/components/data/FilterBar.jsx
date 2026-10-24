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
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-hairline bg-white focus-visible:outline-navy-700 placeholder-gray-400"
            />
          </div>
        )}

        {filters.map((f) => (
          <select
            key={f.key}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="text-xs rounded border border-hairline bg-white px-2.5 py-1.5 focus-visible:outline-navy-700 text-gray-700"
          >
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {hasActiveFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1"
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
