import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { ROUTES, ROLES } from '../../lib/constants';
import { ShieldCheck, Landmark, User, LogOut, ChevronRight, Activity } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function Topbar() {
  const { user, role, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole) => {
    switchRole(newRole);
    if (newRole === ROLES.INSTITUTION) {
      navigate(ROUTES.INSTITUTION_DASHBOARD);
    } else if (newRole === ROLES.ADMIN) {
      navigate(ROUTES.USER_MANAGEMENT);
    } else {
      navigate(ROUTES.OFFICER_DASHBOARD);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0c1424] border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Tricolor National Ribbon */}
      <div className="tricolor-stripe" />

      <div className="h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#122642] to-[#0a1728] text-amber-400 font-bold flex items-center justify-center text-xs shadow-xs border border-amber-500/30 group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight text-sm font-display">
                  AICTE FDR Ledger
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SHA-256 Validated
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden md:block">
                National Security Deposit Regulatory Custody Vault
              </p>
            </div>
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Quick Role Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-[#142036] p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-2">Role:</span>
            <button
              type="button"
              onClick={() => handleRoleSwitch(ROLES.OFFICER)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                role === ROLES.OFFICER
                  ? 'bg-white dark:bg-[#1f3050] text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Officer
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch(ROLES.INSTITUTION)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                role === ROLES.INSTITUTION
                  ? 'bg-white dark:bg-[#1f3050] text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Institution
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch(ROLES.ADMIN)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                role === ROLES.ADMIN
                  ? 'bg-white dark:bg-[#1f3050] text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Dark Mode Toggle Button */}
          <ThemeToggle size="sm" />

          {/* Mock Bank Simulator Button */}
          <Link
            to={ROUTES.MOCK_BANK}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#142036] hover:bg-slate-100 dark:hover:bg-[#1c2d4a] text-slate-700 dark:text-slate-200 font-medium transition-colors"
            title="Core Banking Gateway Simulator"
          >
            <Landmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Bank Console</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* User Profile */}
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#142036] transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.name || 'Staff Officer'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">{role}</p>
            </div>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Sign out of portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
