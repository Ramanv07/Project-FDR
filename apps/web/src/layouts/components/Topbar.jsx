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
    <header className="h-12 border-b border-hairline bg-white px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left indicator */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-navy-800">
          AICTE FDR Trust Ledger
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-xs text-gray-500 capitalize">
          {role} portal
        </span>
      </div>

      {/* Right controls: Demo role switcher + user profile info + logout */}
      <div className="flex items-center gap-4 text-xs">
        {/* Judge demo role switch pill */}
        <div className="flex items-center gap-1.5 bg-surface-100 border border-hairline px-2 py-0.5 rounded text-[11px]">
          <span className="text-gray-400">View as:</span>
          <button
            type="button"
            onClick={() => handleRoleSwitch(ROLES.OFFICER)}
            className={`px-1.5 py-0.5 rounded ${
              role === ROLES.OFFICER
                ? 'bg-navy-700 text-white font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Officer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch(ROLES.INSTITUTION)}
            className={`px-1.5 py-0.5 rounded ${
              role === ROLES.INSTITUTION
                ? 'bg-navy-700 text-white font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Institution
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch(ROLES.ADMIN)}
            className={`px-1.5 py-0.5 rounded ${
              role === ROLES.ADMIN
                ? 'bg-navy-700 text-white font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin
          </button>
        </div>

        <Link
          to={ROUTES.MOCK_BANK}
          className="text-navy-700 hover:text-navy-900 font-medium px-2 py-0.5 rounded border border-navy-200 hover:bg-navy-50"
        >
          Mock Bank
        </Link>

        <span className="text-gray-300">|</span>

        <Link to={ROUTES.PROFILE} className="text-gray-700 hover:text-gray-900 font-medium">
          {user?.name || 'Staff User'}
        </Link>

        <button
          type="button"
          onClick={logout}
          className="text-gray-500 hover:text-status-red"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
