import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ items = [], title = 'AICTE Portal' }) {
  return (
    <aside className="w-sidebar w-[220px] flex-shrink-0 bg-surface-100 border-r border-hairline min-h-screen flex flex-col justify-between">
      <div>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-surface-200">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-navy-700 text-white font-medium flex items-center justify-center text-[10px]">
              FD
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-800 tracking-wide uppercase">
                {title}
              </p>
              <p className="text-[11px] text-gray-500">Trust Ledger v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="py-2">
          {items.map((item) => {
            if (item.divider) {
              return (
                <div
                  key={item.label}
                  className="px-4 pt-3 pb-1 text-[10px] uppercase font-semibold text-gray-400 tracking-wider"
                >
                  {item.label}
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2 text-xs transition-colors border-l-2 ${
                    isActive
                      ? 'border-navy-700 bg-surface-200 text-navy-900 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-surface-200/50 font-normal'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  {item.icon && <span className="text-gray-500">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge != null && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-300 text-gray-700 tabular-nums">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-surface-200 text-[11px] text-gray-400">
        <p>Govt. of India</p>
        <p>AICTE Compliance Portal</p>
      </div>
    </aside>
  );
}
