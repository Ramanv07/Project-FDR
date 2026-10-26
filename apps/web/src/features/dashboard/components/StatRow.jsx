import React from 'react';

export default function StatRow({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
      {stats.map((s, idx) => (
        <div
          key={s.label || idx}
          className="bg-white dark:bg-[#0a1727] rounded-2xl p-6 shadow-xs border border-slate-200/50 dark:border-transparent transition-all"
        >
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#8892a4] mb-2 tracking-tight">
            {s.label}
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white font-display tabular-nums">
              {s.value}
            </span>
          </div>
          {s.subtext && (
            <p className="text-xs text-slate-500 dark:text-[#8892a4] mt-2 font-medium flex items-center gap-1.5">
              {s.subtext}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
