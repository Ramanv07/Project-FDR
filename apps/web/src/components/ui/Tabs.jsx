import React from 'react';

export default function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`border-b border-surface-200 flex gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              isActive
                ? 'border-navy-700 text-navy-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={`text-xs px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-navy-100 text-navy-800' : 'bg-surface-200 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
