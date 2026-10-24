import React from 'react';

export default function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder = '',
  disabled = false,
  error = false,
  className = '',
  id,
  name,
  ...props
}) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors
        ${error ? 'border-status-red focus-visible:outline-status-red' : 'border-hairline focus-visible:outline-navy-700'}
        ${disabled ? 'bg-surface-100 cursor-not-allowed opacity-75' : ''}
        ${className}
      `}
      {...props}
    />
  );
}
