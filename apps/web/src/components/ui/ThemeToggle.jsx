import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ 
  className = '', 
  showLabel = false,
  size = 'md' 
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center gap-1.5 rounded-lg border transition-all duration-200 select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${
        isSmall ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
      } ${
        isDark
          ? 'bg-[#1a263e] border-[#293d61] text-amber-300 hover:bg-[#203150] hover:text-amber-200 hover:border-amber-400/40 shadow-xs'
          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-in spin-in-90 duration-200" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-blue-600 animate-in spin-in-90 duration-200" />
        )}
      </div>

      {showLabel ? (
        <span className="font-semibold font-display tracking-tight">
          {isDark ? 'Light' : 'Dark'}
        </span>
      ) : (
        <span className="hidden sm:inline font-medium text-[11px] font-sans">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
