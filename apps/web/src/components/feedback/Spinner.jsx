import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
  }[size];

  return (
    <div
      className={`inline-block rounded-full border-surface-300 border-t-navy-700 animate-spin ${sizeMap} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
