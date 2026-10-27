import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { ROUTES } from '../lib/constants';

export default function OfficerLayout() {
  const navItems = [
    { to: ROUTES.OFFICER_DASHBOARD, label: 'Officer dashboard' },
    { divider: true, label: 'Registers' },
    { to: ROUTES.FDR_REGISTER, label: 'FDR register' },
    { to: ROUTES.INSTITUTION_LIST, label: 'Institutions' },
    { divider: true, label: 'Compliance & Scrutiny' },
    { to: ROUTES.RISK_QUEUE, label: 'Risk queue' },
    { to: ROUTES.VERIFICATION_QUEUE, label: 'Verification queue' },
    { to: ROUTES.COVERAGE_GAP, label: 'Coverage gap timeline' },
    { to: ROUTES.RELEASE_APPROVALS, label: 'Release approvals' },
    { divider: true, label: 'Analysis' },
    { to: ROUTES.REPORTS, label: 'Reports & export' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#02060d] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar items={navItems} title="Scrutiny Office" />
        <main className="flex-1 px-3.5 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
