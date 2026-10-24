import React from 'react';

export default function PageHeader({ title, description, action, breadcrumb }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-200 pb-4">
      <div>
        {breadcrumb && <div className="text-xs text-gray-500 mb-1">{breadcrumb}</div>}
        <h1 className="text-xl font-medium text-gray-900 leading-tight">{title}</h1>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>

      {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
