import React from 'react';

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  id,
  name,
  className = '',
  ...props
}) {
  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700 ${
        disabled ? 'cursor-not-allowed opacity-60' : ''
      } ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded border-hairline text-navy-700 focus:ring-navy-700 focus:ring-offset-0"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
