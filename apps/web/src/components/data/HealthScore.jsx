import React, { useState } from 'react';
import Dialog from '../ui/Dialog';

export default function HealthScore({ score = 100, reasons = [], fdrNumber = '' }) {
  const [showModal, setShowModal] = useState(false);

  // Color logic strictly for status
  const barColor =
    score >= 70
      ? 'bg-status-green'
      : score >= 40
        ? 'bg-status-amber'
        : 'bg-status-red';

  const textColor =
    score >= 70
      ? 'text-status-green'
      : score >= 40
        ? 'text-status-amber'
        : 'text-status-red';

  return (
    <>
      <div className="inline-flex items-center gap-2">
        <span className={`text-xs font-semibold tabular-nums ${textColor}`}>
          {score}
        </span>

        <div className="w-12 h-1.5 bg-surface-200 rounded-sm overflow-hidden">
          <div
            className={`h-full ${barColor}`}
            style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
          />
        </div>

        {reasons && reasons.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="text-xs text-navy-700 underline hover:text-navy-900"
          >
            Why?
          </button>
        )}
      </div>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Risk score breakdown: ${score}/100`}
        description={fdrNumber ? `Factors affecting FDR #${fdrNumber}` : 'Risk score calculation details'}
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            Base score: 100 points. Points deducted based on verification gaps, timeline discrepancies, and maturity proximity.
          </p>

          <ul className="space-y-2 text-xs text-gray-800 border-t border-hairline pt-3">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-status-red font-medium leading-none">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </Dialog>
    </>
  );
}
