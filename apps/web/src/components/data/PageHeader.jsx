import React from 'react';

export default function PageHeader({ title, description, action, breadcrumb, tag }) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/50 dark:border-transparent pb-6">
      <div>
        {breadcrumb && (
          <div className="text-xs sm:text-sm text-slate-500 dark:text-[#8892a4] mb-1.5 font-medium">{breadcrumb}</div>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-display tracking-tight leading-tight">
            {title}
          </h1>
          {tag && (
            <span className="text-sm font-semibold text-slate-500 dark:text-[#4a8de8] tracking-normal">
              · {tag}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm sm:text-base text-slate-500 dark:text-[#8892a4] mt-2 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex-shrink-0 flex items-center gap-3">{action}</div>}
    </div>
  );
}
