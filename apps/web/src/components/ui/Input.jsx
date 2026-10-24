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
      className={`w-full rounded border px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors
        ${error ? 'border-status-red focus-visible:outline-status-red' : 'border-hairline focus-visible:outline-navy-700'}
        ${disabled ? 'bg-surface-100 cursor-not-allowed opacity-75' : ''}
        ${readOnly ? 'bg-surface-50' : ''}
        ${className}
      `}
      {...props}
    />
  );
}
