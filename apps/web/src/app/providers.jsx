import React from 'react';
import { AuthProvider } from '../features/auth/useAuth';
import { ToastProvider } from '../components/ui/Toast';
import ErrorBoundary from '../components/feedback/ErrorBoundary';

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
