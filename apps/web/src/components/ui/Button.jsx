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
      'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 border border-zinc-900 dark:border-white shadow-xs focus-visible:outline-zinc-900',
    secondary:
      'bg-white dark:bg-[#1a1d23] text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-[#22252c] shadow-xs focus-visible:outline-zinc-400',
    accent:
      'bg-amber-600 hover:bg-amber-500 text-white border border-amber-600 shadow-xs focus-visible:outline-amber-600',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white border border-rose-600 shadow-xs focus-visible:outline-rose-600',
    ghost:
      'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1a1d23] shadow-none focus-visible:outline-zinc-400',
  }[variant] || '';

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
