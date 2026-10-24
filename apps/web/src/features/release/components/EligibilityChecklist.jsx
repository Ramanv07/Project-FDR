import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function EligibilityChecklist({ items = [], allRequiredMet = false }) {
  return (
    <div className="border border-hairline rounded bg-surface-50 p-4">
      <div className="flex items-center justify-between pb-3 border-b border-surface-200 mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
          Statutory release eligibility checklist
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded ${
            allRequiredMet
              ? 'bg-green-100 text-status-green border border-green-200'
              : 'bg-red-50 text-status-red border border-red-200'
          }`}
        >
          {allRequiredMet ? 'Eligible for release' : 'Conditions incomplete'}
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {it.passed ? (
                <CheckCircle2 className="w-4 h-4 text-status-green flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-status-red flex-shrink-0" />
              )}
              <span className={it.passed ? 'text-gray-800' : 'text-gray-500 line-through'}>
                {it.label}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              {it.required ? 'Mandatory' : 'Optional'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
