import React from 'react';
import { formatDate } from '../../../lib/format';

export default function FdrTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return <p className="text-xs text-gray-500">No events recorded on ledger.</p>;
  }

  return (
    <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-300 dark:before:bg-slate-700">
      {events.map((ev, index) => (
        <div key={index} className="relative flex items-start gap-3 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-navy-700 dark:bg-blue-500 border-2 border-white dark:border-[#0f172a] -ml-[19px] mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-slate-100 leading-tight">{ev.event}</p>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              <span>{formatDate(ev.date) || ev.date}</span>
              {ev.user && (
                <>
                  <span>•</span>
                  <span>{ev.user}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
