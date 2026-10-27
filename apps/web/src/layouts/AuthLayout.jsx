import React from 'react';
import { Outlet } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-[#02060d] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 relative transition-colors duration-200">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle size="sm" />
      </div>

      <div className="flex-1 flex items-center justify-center py-12">
        <Outlet />
      </div>

      <footer className="text-center text-xs text-gray-400 py-4">
        All India Council for Technical Education • Nelson Mandela Marg, Vasant Kunj, New Delhi-110070
      </footer>
    </div>
  );
}
