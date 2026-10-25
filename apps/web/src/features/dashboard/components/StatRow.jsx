import React from 'react';

export default function StatRow({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((s, idx) => (
        <div
          key={s.label || idx}
          className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all"
        >
          <p className="text-xs font-semibold text-slate-500 mb-1 tracking-tight">
            {s.label}
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-950 font-display tabular-nums">
              {s.value}
            </span>
          </div>
          {s.subtext && (
            <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center gap-1">
              {s.subtext}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
