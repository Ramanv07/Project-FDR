import React from 'react';

export default function PageHeader({ title, description, action, breadcrumb, tag }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        {breadcrumb && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">{breadcrumb}</div>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-display tracking-tight leading-tight">
            {title}
          </h1>
          {tag && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {tag}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
