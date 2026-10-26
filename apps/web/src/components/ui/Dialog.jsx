import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-md',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className={`relative w-full ${maxWidth} bg-white dark:bg-[#0f172a] rounded-xl border border-hairline dark:border-slate-800 p-6 shadow-xl transition-colors`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-base font-bold text-gray-900 dark:text-white font-display">{title}</h3>}
            {description && <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white rounded p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
