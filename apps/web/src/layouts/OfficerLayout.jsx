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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar items={navItems} title="Scrutiny Office" />
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8 max-w-content overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
