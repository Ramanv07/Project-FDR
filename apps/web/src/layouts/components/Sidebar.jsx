import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Building2,
  AlertTriangle,
  ShieldCheck,
  CalendarClock,
  CheckSquare,
  BarChart3,
  Users,
  BellRing,
  ScrollText,
  FilePlus,
  Landmark,
  Shield,
  ExternalLink,
} from 'lucide-react';

// Map label to icon automatically if not provided
const getIconForLabel = (label = '') => {
  const l = label.toLowerCase();
  if (l.includes('dashboard') || l.includes('overview') || l.includes('officer view'))
    return <LayoutDashboard className="w-4 h-4" />;
  if (l.includes('fdr register') || l.includes('my fdrs'))
    return <FileSpreadsheet className="w-4 h-4" />;
  if (l.includes('submit')) return <FilePlus className="w-4 h-4" />;
  if (l.includes('institution') || l.includes('institute'))
    return <Building2 className="w-4 h-4" />;
  if (l.includes('risk')) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  if (l.includes('verification')) return <ShieldCheck className="w-4 h-4 text-blue-500" />;
  if (l.includes('gap') || l.includes('timeline')) return <CalendarClock className="w-4 h-4" />;
  if (l.includes('approval') || l.includes('release')) return <CheckSquare className="w-4 h-4" />;
  if (l.includes('report')) return <BarChart3 className="w-4 h-4" />;
  if (l.includes('user')) return <Users className="w-4 h-4" />;
  if (l.includes('alert')) return <BellRing className="w-4 h-4" />;
  if (l.includes('audit')) return <ScrollText className="w-4 h-4" />;
  if (l.includes('bank')) return <Landmark className="w-4 h-4" />;
  return <Shield className="w-4 h-4" />;
};

export default function Sidebar({ items = [], title = 'AICTE Portal' }) {
  return (
    <aside className="w-60 flex-shrink-0 bg-white dark:bg-[#0c1424] border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-56px)] flex flex-col justify-between select-none transition-colors duration-200">
      <div>
        {/* Sidebar Context Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0f172a]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0F2444] text-amber-400 font-bold flex items-center justify-center text-xs shadow-xs">
              🏛️
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white tracking-wide font-display">
                {title}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Regulatory Console v2.0</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-2 space-y-0.5">
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`div-${index}-${item.label}`}
                  className="px-3 pt-3.5 pb-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider"
                >
                  {item.label}
                </div>
              );
            }

            const icon = item.icon || getIconForLabel(item.label);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50/80 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-semibold shadow-xs border border-blue-200/60 dark:border-blue-800/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="flex-shrink-0 text-slate-500 dark:text-slate-400">{icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge != null && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 tabular-nums">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#0f172a]/60">
        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>Statutory Compliance Valid</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
          Ministry of Education, Govt. of India. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
