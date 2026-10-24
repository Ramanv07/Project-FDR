import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-3 rounded border text-sm shadow-sm bg-white ${
              toast.type === 'success'
                ? 'border-status-green text-gray-800'
                : toast.type === 'error'
                  ? 'border-status-red text-gray-800'
                  : 'border-hairline text-gray-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-status-green flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-status-red flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-navy-700 flex-shrink-0 mt-0.5" />}
            <span className="flex-1 text-xs leading-normal">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      addToast: (msg) => console.log('Toast:', msg),
    };
  }
  return ctx;
}
