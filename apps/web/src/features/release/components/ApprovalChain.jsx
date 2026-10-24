import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { formatDate } from '../../../lib/format';

export default function ApprovalChain({ approvals = [], currentStep = 'officer' }) {
  const steps = [
    { key: 'officer', label: '1. Scrutiny Officer' },
    { key: 'section_head', label: '2. Section Head' },
    { key: 'competent_authority', label: '3. Competent Authority' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Statutory approval workflow chain
      </h3>

      <div className="space-y-3">
        {steps.map((st) => {
          const record = approvals.find((a) => a.step === st.key) || {};
          const isDone = Boolean(record.approvedBy && record.approvedAt);
          const isCurrent = currentStep === st.key && !isDone;

          return (
            <div
              key={st.key}
              className={`p-3 rounded border text-xs transition-colors ${
                isCurrent
                  ? 'border-navy-700 bg-navy-50/50'
                  : isDone
                    ? 'border-green-200 bg-green-50/40'
                    : 'border-hairline bg-surface-50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-status-green flex-shrink-0" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 text-navy-700 animate-pulse flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`font-medium ${isCurrent ? 'text-navy-900 font-semibold' : 'text-gray-800'}`}>
                    {st.label}
                  </span>
                </div>

                <span
                  className={`text-[11px] px-2 py-0.5 rounded ${
                    isDone
                      ? 'bg-green-100 text-status-green font-medium'
                      : isCurrent
                        ? 'bg-navy-100 text-navy-800 font-medium'
                        : 'text-gray-400'
                  }`}
                >
                  {isDone ? 'Approved' : isCurrent ? 'Action required' : 'Pending'}
                </span>
              </div>

              {isDone && (
                <div className="mt-2 pt-2 border-t border-green-200/50 text-[11px] text-gray-600">
                  <p>
                    Approved by: <strong>{record.approvedBy}</strong> on {formatDate(record.approvedAt)}
                  </p>
                  {record.remarks && <p className="italic mt-0.5">"{record.remarks}"</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
