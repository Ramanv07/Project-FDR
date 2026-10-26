import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'max-w-lg',
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-30">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className={`w-screen ${width} bg-white dark:bg-[#0f172a] border-l border-hairline dark:border-slate-800 shadow-xl flex flex-col transition-colors`}>
          <div className="p-5 border-b border-surface-200 dark:border-slate-800 flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
              {description && <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
