import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-between p-4">
      <div className="flex-1 flex items-center justify-center py-12">
        <Outlet />
      </div>

      <footer className="text-center text-xs text-gray-400 py-4">
        All India Council for Technical Education • Nelson Mandela Marg, Vasant Kunj, New Delhi-110070
      </footer>
    </div>
  );
}
