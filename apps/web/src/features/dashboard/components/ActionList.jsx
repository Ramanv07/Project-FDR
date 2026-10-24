import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function ActionList({ actions = [] }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="mb-6 border border-hairline rounded bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-status-amber" />
        <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
          Action required ({actions.length})
        </h2>
      </div>

      <div className="divide-y divide-surface-200">
        {actions.map((act, idx) => (
          <div
            key={idx}
            className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
          >
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-status-amber mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{act.title}</p>
                {act.description && <p className="text-gray-500 text-[11px] mt-0.5">{act.description}</p>}
              </div>
            </div>

            {act.link && (
              <Link
                to={act.link}
                className="inline-flex items-center gap-1 text-navy-700 hover:text-navy-900 font-medium ml-4 flex-shrink-0"
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
