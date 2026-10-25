import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  onClick,
  icon,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-center select-none active:scale-[0.98] shadow-xs';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 gap-2 font-medium',
    lg: 'text-sm px-5 py-2.5 gap-2.5 font-semibold',
  }[size] || 'text-sm px-4 py-2 gap-2 font-medium';

  const variantStyles = {
    primary:
      'bg-gradient-to-b from-[#162e50] to-[#0d1e36] text-white hover:from-[#1c3861] hover:to-[#122744] border border-[#0d1e36] shadow-sm hover:shadow-md focus-visible:outline-[#162e50]',
    secondary:
      'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs focus-visible:outline-slate-400',
    accent:
      'bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 shadow-sm hover:shadow focus-visible:outline-amber-600',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white border border-rose-700 shadow-xs focus-visible:outline-rose-600',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 shadow-none focus-visible:outline-slate-300',
  }[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
