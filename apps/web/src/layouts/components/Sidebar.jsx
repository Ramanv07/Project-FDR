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
  if (l.includes('risk')) return <AlertTriangle className="w-4 h-4 text-[#c9a96e]" />;
  if (l.includes('verification')) return <ShieldCheck className="w-4 h-4 text-[#4a8de8]" />;
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
    <aside className="hidden md:flex w-64 flex-shrink-0 bg-white dark:bg-[#02060d] border-r border-slate-200/50 dark:border-[rgba(56,189,248,0.08)] min-h-[calc(100vh-56px)] flex-col justify-between select-none transition-colors duration-200">
      <div>
        {/* Sidebar Context Header */}
        <div className="p-5 border-b border-slate-100 dark:border-[rgba(56,189,248,0.08)] bg-slate-50/50 dark:bg-[#050c16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F2444] text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs border border-amber-500/20">
              🏛️
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white tracking-wide font-display">
                {title}
              </p>
              <p className="text-xs text-slate-500 dark:text-[#8daecf] font-medium">Regulatory Console</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`div-${index}-${item.label}`}
                  className="px-3.5 pt-4 pb-1.5 text-xs uppercase font-bold text-slate-400 dark:text-[#5a7b9c] tracking-wider"
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
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50/80 dark:bg-[#071223] text-blue-800 dark:text-[#38bdf8] font-semibold border border-transparent'
                      : 'text-slate-600 dark:text-[#8daecf] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-[#050c16] border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="flex-shrink-0 text-slate-500 dark:text-[#8daecf]">{icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge != null && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-[#071223] text-amber-800 dark:text-[#f59e0b] tabular-nums">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-5 border-t border-slate-100 dark:border-[rgba(56,189,248,0.08)] bg-slate-50/60 dark:bg-[#050c16]">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium mb-1.5">
          <ShieldCheck className="w-4 h-4 text-[#10b981] flex-shrink-0" />
          <span>Statutory Compliance Valid</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-[#5a7b9c] leading-relaxed">
          AICTE FDR Trust Ledger • Govt. of India
        </p>
      </div>
    </aside>
  );
}
