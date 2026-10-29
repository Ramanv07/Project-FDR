import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { ROUTES } from '../../lib/constants';
import { Landmark, LogOut, Bot, Compass } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function Topbar() {
  const { user, role, logout } = useAuth();

  const topbarTheme = 'bg-white dark:bg-[#111215] border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100';

  return (
    <header className="sticky top-2 sm:top-3.5 z-40 px-3 sm:px-6 w-full flex justify-center pointer-events-none transition-all duration-200">
      <div className="pointer-events-auto w-full max-w-7xl mx-auto rounded-full bg-white/85 dark:bg-[#16181d]/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-md dark:shadow-2xl px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 text-zinc-900 dark:text-zinc-100">
        {/* Left Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#18191c] to-[#0d0e11] text-amber-400 font-bold flex items-center justify-center shadow-xs border border-amber-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
              <Landmark className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-zinc-950 dark:text-white tracking-tight text-sm sm:text-base font-display truncate block">
                AICTE FDR Ledger
              </span>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-400 hidden md:block truncate">
                National Security Deposit Regulatory Custody Vault
              </p>
            </div>
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-sm">
          {/* Dark Mode Toggle Button */}
          <ThemeToggle size="sm" />

          {/* AICTE Sahayak AI Link */}
          <Link
            to={ROUTES.AI_ASSISTANT}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold transition-all text-xs"
            title="AICTE Sahayak Regulatory AI Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">AI Sahayak</span>
          </Link>

          {/* 12 Regional Offices Shortcut for Officer/Admin */}
          {(role === 'officer' || role === 'admin') && (
            <Link
              to={ROUTES.REGIONAL_DASHBOARD}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-zinc-50 dark:bg-[#1a1d23] hover:bg-zinc-100 dark:hover:bg-[#24272f] text-zinc-700 dark:text-zinc-300 hover:dark:text-white font-medium transition-colors text-xs hidden md:inline-flex"
              title="12 AICTE Regional Directorates Matrix"
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>12 Regional Offices</span>
            </Link>
          )}

          {/* Mock Bank Simulator Button (Pill Style) */}
          <Link
            to={ROUTES.MOCK_BANK}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-zinc-50 dark:bg-[#1a1d23] hover:bg-zinc-100 dark:hover:bg-[#24272f] text-zinc-700 dark:text-zinc-300 hover:dark:text-white font-medium transition-colors text-xs"
            title="Core Banking Gateway Simulator"
          >
            <Landmark className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span className="hidden lg:inline">Bank Simulator</span>
          </Link>

          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

          {/* User Profile (Pill Style) */}
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-[#1f2128] transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/60"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
                {user?.name || 'Staff Officer'}
              </p>
              <p className="text-[10px] text-zinc-400 capitalize">{role}</p>
            </div>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="p-2 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Sign out of portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
