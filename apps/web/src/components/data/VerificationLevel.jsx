import React from 'react';
import { TRUST_LEVELS } from '../../lib/constants';

export default function VerificationLevel({ level = 'submitted', showLabel = true, className = '' }) {
  const steps = [
    TRUST_LEVELS.SUBMITTED,
    TRUST_LEVELS.AI_CHECKED,
    TRUST_LEVELS.OFFICER_REVIEWED,
    TRUST_LEVELS.BANK_CONFIRMED,
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === level);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const currentStep = steps[activeIndex];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {steps.map((step, idx) => {
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          return (
            <div
              key={step.key}
              title={`${step.label} (${idx + 1}/4)`}
              className={`h-1.5 w-4 rounded-sm transition-colors ${
                isCompleted
                  ? isCurrent && idx === 3
                    ? 'bg-status-green'
                    : 'bg-navy-700 dark:bg-blue-500'
                  : 'bg-surface-300 dark:bg-slate-700'
              }`}
            />
          );
        })}
      </div>

      {showLabel && (
        <span className="text-xs text-gray-700 dark:text-slate-300 font-medium">
          {currentStep.label}
        </span>
      )}
    </div>
  );
}
