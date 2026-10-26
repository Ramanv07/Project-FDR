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
    <div className="min-h-screen bg-surface-50 dark:bg-[#060e18] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar items={navItems} title="System Admin" />
        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
