import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { ROUTES, ROLES } from '../../lib/constants';

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
    <header className="h-12 border-b border-slate-300 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-[#1F3A5F] text-white font-bold flex items-center justify-center text-[11px] tracking-tight">
          AICTE
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            FDR Trust Ledger
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-600 capitalize">
            {role} Portal
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 text-xs">
        {/* Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
          <span className="text-slate-500 font-medium">Role:</span>
          <button
            type="button"
            onClick={() => handleRoleSwitch(ROLES.OFFICER)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              role === ROLES.OFFICER
                ? 'bg-[#1F3A5F] text-white'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            Officer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch(ROLES.INSTITUTION)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              role === ROLES.INSTITUTION
                ? 'bg-[#1F3A5F] text-white'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            Institution
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch(ROLES.ADMIN)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              role === ROLES.ADMIN
                ? 'bg-[#1F3A5F] text-white'
                : 'text-slate-700 hover:text-black'
            }`}
          >
            Admin
          </button>
        </div>

        <Link
          to={ROUTES.MOCK_BANK}
          className="text-xs font-medium px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        >
          Mock Bank
        </Link>

        <span className="text-slate-300">|</span>

        <Link
          to={ROUTES.PROFILE}
          className="text-slate-700 hover:underline font-medium"
        >
          {user?.name || 'Staff User'}
        </Link>

        <button
          type="button"
          onClick={logout}
          className="text-slate-500 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
