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
    'inline-flex items-center justify-center font-medium rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-center select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2',
  }[size] || 'text-sm px-3.5 py-1.5 gap-2';

  const variantStyles = {
    primary:
      'bg-[#1F3A5F] text-white hover:bg-[#162a44] border border-[#142742] focus-visible:outline-[#1F3A5F]',
    secondary:
      'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus-visible:outline-[#1F3A5F]',
    danger:
      'bg-red-700 text-white hover:bg-red-800 border border-red-800 focus-visible:outline-red-700',
    ghost:
      'text-slate-700 hover:text-black hover:bg-slate-100 focus-visible:outline-slate-400',
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
