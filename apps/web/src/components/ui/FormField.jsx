import React from 'react';

export default function FormField({
  label,
  htmlFor,
  error,
  helperText,
  badge,
  required = false,
  className = '',
  children,
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-status-red ml-1">*</span>}
          </label>
          {badge && (
            <span className="text-xs text-navy-600 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
              {badge}
            </span>
          )}
        </div>
      )}

      {children}

      {error ? (
        <p className="text-xs text-status-red mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
