import React from 'react';

export default function StatRow({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-slate-300 rounded p-3.5">
          <p className="text-[11px] font-medium text-slate-500 mb-1">{s.label}</p>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {s.value}
            </span>
            {s.subtext && <span className="text-[11px] text-slate-500">{s.subtext}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
