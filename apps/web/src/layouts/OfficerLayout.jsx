import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { ROUTES } from '../lib/constants';
import AiChatWidget from '../features/assistant/components/AiChatWidget';

export default function OfficerLayout() {
  const navItems = [
    { to: ROUTES.OFFICER_DASHBOARD, label: 'Officer dashboard' },
    { divider: true, label: 'Regional Directorate' },
    { to: ROUTES.REGIONAL_DASHBOARD, label: '12 Regional Offices' },
    { divider: true, label: 'Registers' },
    { to: ROUTES.FDR_REGISTER, label: 'FDR register' },
    { to: ROUTES.INSTITUTION_LIST, label: 'Institutions' },
    { divider: true, label: 'Compliance & Scrutiny' },
    { to: ROUTES.RISK_QUEUE, label: 'Risk queue' },
    { to: ROUTES.VERIFICATION_QUEUE, label: 'Verification queue' },
    { to: ROUTES.COVERAGE_GAP, label: 'Coverage gap timeline' },
    { to: ROUTES.RELEASE_APPROVALS, label: 'Release approvals' },
    { divider: true, label: 'AI & Intelligence' },
    { to: ROUTES.AI_ASSISTANT, label: 'AICTE Sahayak (AI)' },
    { divider: true, label: 'Analysis' },
    { to: ROUTES.REPORTS, label: 'Reports & export' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#0d0e11] text-zinc-900 dark:text-zinc-100 flex transition-colors duration-200">
      <Sidebar items={navItems} title="Scrutiny Office" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <AiChatWidget />
    </div>
  );
}
