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
      'bg-gradient-to-b from-[#162e50] to-[#0d1e36] dark:from-[#0284c7] dark:to-[#0369a1] text-white hover:from-[#1c3861] hover:to-[#122744] dark:hover:from-[#0ea5e9] dark:hover:to-[#0284c7] border border-[#0d1e36] dark:border-[#0284c7] shadow-sm hover:shadow-md focus-visible:outline-[#162e50]',
    secondary:
      'bg-white dark:bg-[#071223] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[rgba(56,189,248,0.16)] hover:bg-slate-50 dark:hover:bg-[#0a182e] hover:border-slate-300 shadow-xs focus-visible:outline-slate-400',
    accent:
      'bg-amber-600 hover:bg-amber-700 dark:bg-[#b89150] dark:hover:bg-[#c9a15c] text-white border border-amber-700 dark:border-[#96743b] shadow-sm hover:shadow focus-visible:outline-amber-600',
    danger:
      'bg-rose-600 hover:bg-rose-700 dark:bg-[#b85b68] dark:hover:bg-[#c96978] text-white border border-rose-700 dark:border-[#994753] shadow-xs focus-visible:outline-rose-600',
    ghost:
      'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-[#071223] shadow-none focus-visible:outline-slate-300',
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
