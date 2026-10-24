import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md'
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-center';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  const variantStyles = {
    primary: 'bg-navy-700 text-white hover:bg-navy-800 focus-visible:outline-navy-700',
    secondary:
      'bg-white text-gray-700 border border-hairline hover:bg-surface-100 focus-visible:outline-navy-700',
    danger: 'bg-status-red text-white hover:opacity-90 focus-visible:outline-status-red',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-surface-200 focus-visible:outline-navy-700',
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
