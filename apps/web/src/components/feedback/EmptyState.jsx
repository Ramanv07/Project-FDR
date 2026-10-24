import React from 'react';

export default function EmptyState({ message = 'No records found.', action = null }) {
  return (
    <div className="p-8 text-center border border-hairline rounded bg-white">
      <p className="text-xs text-gray-500">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
