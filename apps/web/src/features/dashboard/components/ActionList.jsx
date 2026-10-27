import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function ActionList({ actions = [] }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="mb-6 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-[#16181d] p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          Action required ({actions.length})
        </h2>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
        {actions.map((act, idx) => (
          <div
            key={idx}
            className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
          >
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-status-amber mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800 dark:text-slate-200">{act.title}</p>
                {act.description && <p className="text-gray-500 dark:text-slate-400 text-[11px] mt-0.5">{act.description}</p>}
              </div>
            </div>

            {act.link && (
              <Link
                to={act.link}
                className="inline-flex items-center gap-1 text-navy-700 dark:text-blue-400 hover:text-navy-900 dark:hover:text-blue-300 font-medium ml-4 flex-shrink-0"
              >
                <span>{act.actionLabel || 'Resolve'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
