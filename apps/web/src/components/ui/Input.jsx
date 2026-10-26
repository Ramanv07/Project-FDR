import React from 'react';

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  readOnly = false,
  error = false,
  className = '',
  id,
  name,
  ...props
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      className={`w-full rounded border px-3 py-1.5 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 bg-white dark:bg-[#0c1424] transition-colors
        ${error ? 'border-status-red focus-visible:outline-status-red' : 'border-hairline dark:border-slate-700 focus-visible:outline-navy-700 dark:focus-visible:outline-blue-500'}
        ${disabled ? 'bg-surface-100 dark:bg-slate-800 cursor-not-allowed opacity-75' : ''}
        ${readOnly ? 'bg-surface-50 dark:bg-[#080d19]' : ''}
        ${className}
      `}
      {...props}
    />
  );
}
