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
  GraduationCap,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../lib/constants';

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

const ROLE_IDENTITIES = {
  [ROLES.OFFICER]: {
    name: 'AICTE Scrutiny Bureau',
    sub: 'Regional Directorate • New Delhi',
    iconBg: 'bg-zinc-100 dark:bg-[#1c1e24] border-zinc-200 dark:border-zinc-700/60 text-sky-500',
    icon: <Landmark className="w-5 h-5 text-sky-500" />,
    darkCanvas: '#0e1013',
    lightCanvas: '#fbfcfd',
    borderColor: 'border-zinc-200/80 dark:border-zinc-800/80',
    headerBg: 'bg-white/90 dark:bg-[#131519]/90',
    activeLink: 'bg-zinc-100 dark:bg-white/[0.07] text-zinc-950 dark:text-white font-semibold border-l-2 border-l-sky-500',
    dotColor: 'rgba(255, 255, 255, 0.045)',
  },
  [ROLES.INSTITUTION]: {
    name: 'Technical Institution',
    sub: 'Approved College Registrar',
    iconBg: 'bg-zinc-100 dark:bg-[#1c1e24] border-zinc-200 dark:border-zinc-700/60 text-emerald-500',
    icon: <GraduationCap className="w-5 h-5 text-emerald-500" />,
    darkCanvas: '#0e1013',
    lightCanvas: '#fbfcfd',
    borderColor: 'border-zinc-200/80 dark:border-zinc-800/80',
    headerBg: 'bg-white/90 dark:bg-[#131519]/90',
    activeLink: 'bg-zinc-100 dark:bg-white/[0.07] text-zinc-950 dark:text-white font-semibold border-l-2 border-l-emerald-500',
    dotColor: 'rgba(255, 255, 255, 0.045)',
  },
  [ROLES.ADMIN]: {
    name: 'Vault Governance',
    sub: 'Cryptographic Merkle Sentinel',
    iconBg: 'bg-zinc-100 dark:bg-[#1c1e24] border-zinc-200 dark:border-zinc-700/60 text-amber-500',
    icon: <Lock className="w-5 h-5 text-amber-500" />,
    darkCanvas: '#0e1013',
    lightCanvas: '#fbfcfd',
    borderColor: 'border-zinc-200/80 dark:border-zinc-800/80',
    headerBg: 'bg-white/90 dark:bg-[#131519]/90',
    activeLink: 'bg-zinc-100 dark:bg-white/[0.07] text-zinc-950 dark:text-white font-semibold border-l-2 border-l-amber-500',
    dotColor: 'rgba(255, 255, 255, 0.045)',
  },
};

export default function Sidebar({ items = [], title }) {
  const { role } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const identity = ROLE_IDENTITIES[role] || ROLE_IDENTITIES[ROLES.OFFICER];
  const displayTitle = title || identity.name;

  return (
    <aside
      data-sidebar="true"
      className={`hidden md:flex w-64 flex-shrink-0 border-r ${identity.borderColor} h-screen sticky top-0 flex-col justify-between select-none transition-colors duration-200 relative overflow-hidden overflow-y-auto`}
      style={{
        backgroundColor: isDark ? identity.darkCanvas : identity.lightCanvas,
        backgroundImage: isDark
          ? `radial-gradient(${identity.dotColor} 1.1px, transparent 1.1px)`
          : 'radial-gradient(rgba(100, 116, 139, 0.14) 1.1px, transparent 1.1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="relative z-10">
        {/* Sidebar Context Header — Custom Dynamic Role Identity */}
        <div className={`p-4 border-b ${identity.borderColor} ${identity.headerBg} backdrop-blur-md`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${identity.iconBg} font-bold flex items-center justify-center text-lg shadow-xs border flex-shrink-0`}>
              {identity.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight font-display truncate">
                {displayTitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-[#8daecf] font-medium truncate mt-0.5">
                {identity.sub}
              </p>
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
                  className="px-3.5 pt-4 pb-1.5 text-[11px] uppercase font-bold text-slate-400 dark:text-[#5a7b9c] tracking-wider"
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
                      ? identity.activeLink
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04] border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-500">{icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge != null && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-zinc-100 dark:bg-[#1c1e24] text-zinc-800 dark:text-zinc-200 tabular-nums">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className={`relative z-10 p-4 border-t ${identity.borderColor} ${identity.headerBg} backdrop-blur-md`}>
        <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Statutory Compliance Active</span>
        </div>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
          AICTE FDR Trust Ledger • ISO 27001
        </p>
      </div>
    </aside>
  );
}
