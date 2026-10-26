import React from 'react';
import { AuthProvider } from '../features/auth/useAuth';
import { ToastProvider } from '../components/ui/Toast';
import { ThemeProvider } from '../context/ThemeContext';
import ErrorBoundary from '../components/feedback/ErrorBoundary';

export default function Providers({ children }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
