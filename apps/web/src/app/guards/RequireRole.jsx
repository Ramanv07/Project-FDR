import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';

export default function RequireRole({ allowedRoles = [], children }) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
