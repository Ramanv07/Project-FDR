import React from 'react';

export default function Select({
  value,
  onChange,
  options = [],
  disabled = false,
  error = false,
  className = '',
  id,
  name,
  ...props
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded border px-3 py-1.5 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-[#0c1424] transition-colors
        ${error ? 'border-status-red focus-visible:outline-status-red' : 'border-hairline dark:border-slate-700 focus-visible:outline-navy-700 dark:focus-visible:outline-blue-500'}
        ${disabled ? 'bg-surface-100 dark:bg-slate-800 cursor-not-allowed opacity-75' : ''}
        ${className}
      `}
      {...props}
    >
      {options.map((opt) => {
        const val = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        return (
          <option key={val} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
