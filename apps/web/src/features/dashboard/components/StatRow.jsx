import React from 'react';

export default function StatRow({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="border border-hairline rounded bg-white p-4">
          <p className="text-xs text-gray-500 mb-1">{s.label}</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-medium text-gray-900 tabular-nums">
              {s.value}
            </span>
            {s.subtext && <span className="text-[11px] text-gray-400">{s.subtext}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
