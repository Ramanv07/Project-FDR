import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fdr_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'user-04',
          name: 'R.K. Pandey',
          email: 'rk.pandey@aicte.gov.in',
          role: 'officer',
          institutionId: null,
          institutionName: null,
        };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fdr_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fdr_user');
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.registerInstitution(data);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Helper for seamless demo switching between roles
  const switchRole = (role) => {
    const defaults = {
      institution: {
        id: 'user-01',
        name: 'Meena Sharma',
        email: 'meena@gecraipur.ac.in',
        role: 'institution',
        institutionId: 'inst-01',
        institutionName: 'Government Engineering College, Raipur',
      },
      officer: {
        id: 'user-04',
        name: 'R.K. Pandey',
        email: 'rk.pandey@aicte.gov.in',
        role: 'officer',
        institutionId: null,
        institutionName: null,
      },
      admin: {
        id: 'user-06',
        name: 'Admin',
        email: 'admin@aicte.gov.in',
        role: 'admin',
        institutionId: null,
        institutionName: null,
      },
    };
    if (defaults[role]) {
      setUser(defaults[role]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
