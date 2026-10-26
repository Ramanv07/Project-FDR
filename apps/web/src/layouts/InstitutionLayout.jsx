import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { ROUTES } from '../lib/constants';

export default function InstitutionLayout() {
  const navItems = [
    { to: ROUTES.INSTITUTION_DASHBOARD, label: 'Overview' },
    { divider: true, label: 'FDR Compliance' },
    { to: ROUTES.SUBMIT_FDR, label: 'Submit new FDR' },
    { to: ROUTES.MY_FDRS, label: 'My FDRs' },
    { divider: true, label: 'Deposits' },
    { to: '/institution/fdrs', label: 'Renew or release' },
    { divider: true, label: 'Settings' },
    { to: ROUTES.PROFILE, label: 'Institute profile' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-[#060e18] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar items={navItems} title="Institution" />
        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
