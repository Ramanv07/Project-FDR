import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { ROUTES } from '../lib/constants';
import AiChatWidget from '../features/assistant/components/AiChatWidget';

export default function InstitutionLayout() {
  const navItems = [
    { to: ROUTES.INSTITUTION_DASHBOARD, label: 'Overview' },
    { divider: true, label: 'FDR Compliance' },
    { to: ROUTES.SUBMIT_FDR, label: 'Submit new FDR' },
    { to: ROUTES.MY_FDRS, label: 'My FDRs' },
    { divider: true, label: 'Deposits' },
    { to: '/institution/fdrs', label: 'Renew or release' },
    { divider: true, label: 'AI Assistance' },
    { to: ROUTES.AI_ASSISTANT, label: 'AICTE Sahayak (AI)' },
    { divider: true, label: 'Settings' },
    { to: ROUTES.PROFILE, label: 'Institute profile' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#0d0e11] text-zinc-900 dark:text-zinc-100 flex transition-colors duration-200">
      <Sidebar items={navItems} title="Institution" />
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
