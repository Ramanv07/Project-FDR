import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { ROUTES } from '../lib/constants';

export default function AdminLayout() {
  const navItems = [
    { to: ROUTES.USER_MANAGEMENT, label: 'User management' },
    { to: ROUTES.ALERT_SETTINGS, label: 'Alert settings' },
    { to: ROUTES.AUDIT_LEDGER, label: 'Audit ledger' },
    { divider: true, label: 'Direct Access' },
    { to: ROUTES.OFFICER_DASHBOARD, label: 'Officer view' },
    { to: ROUTES.MOCK_BANK, label: 'Mock bank console' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#0d0e11] text-zinc-900 dark:text-zinc-100 flex transition-colors duration-200">
      <Sidebar items={navItems} title="System Admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
