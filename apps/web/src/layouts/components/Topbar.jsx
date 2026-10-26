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
    <header className="sticky top-0 z-40 bg-white dark:bg-[#060e18] border-b border-slate-200/50 dark:border-[rgba(56,136,235,0.08)] shadow-xs">

      <div className="h-16 px-5 sm:px-8 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3.5">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#122642] to-[#0a1728] text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs border border-amber-500/30 group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base font-display">
                  AICTE FDR Ledger
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8295ac] hidden md:block">
                National Security Deposit Regulatory Custody Vault
              </p>
            </div>
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 text-sm">
          {/* Quick Role Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-[#0a1727] p-1 rounded-xl border border-transparent">
            <span className="text-xs font-semibold text-slate-400 dark:text-[#8295ac] px-2.5">Role:</span>
            <button
              type="button"
              onClick={() => handleRoleSwitch(ROLES.OFFICER)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === ROLES.OFFICER
                  ? 'bg-white dark:bg-[#0e2035] text-slate-900 dark:text-[#3888eb] shadow-xs'
                  : 'text-slate-600 dark:text-[#8295ac] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Officer
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch(ROLES.INSTITUTION)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === ROLES.INSTITUTION
                  ? 'bg-white dark:bg-[#0e2035] text-slate-900 dark:text-[#3888eb] shadow-xs'
                  : 'text-slate-600 dark:text-[#8295ac] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Institution
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch(ROLES.ADMIN)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === ROLES.ADMIN
                  ? 'bg-white dark:bg-[#0e2035] text-slate-900 dark:text-[#3888eb] shadow-xs'
                  : 'text-slate-600 dark:text-[#8295ac] hover:text-slate-900 dark:hover:text-white'
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-transparent bg-slate-50 dark:bg-[#0a1727] hover:bg-slate-100 dark:hover:bg-[#0e2035] text-slate-700 dark:text-[#8295ac] hover:dark:text-white font-medium transition-colors text-xs"
            title="Core Banking Gateway Simulator"
          >
            <Landmark className="w-4 h-4 text-[#3888eb]" />
            <span className="hidden md:inline">Bank Simulator</span>
          </Link>

          <div className="h-5 w-px bg-slate-200/60 dark:bg-[rgba(56,136,235,0.12)] hidden sm:block" />

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
