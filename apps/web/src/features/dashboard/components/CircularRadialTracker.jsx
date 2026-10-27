import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function CircularRadialTracker({
  percentage = 100,
  size = 180,
  strokeWidth = 14,
  primaryColor = '#10b981',
  secondaryColor = '#059669',
  title = 'Statutory Quota',
  subtitle = 'Fully Funded',
  centerValue = '100%',
  rings = null, // Optional multi-ring array: [{ label, percent, color }]
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // If multi-ring tracker (for Officer Dashboard)
  if (rings && rings.length > 0) {
    const center = size / 2;
    const baseRadius = (size - strokeWidth) / 2;
    const ringSpacing = strokeWidth + 4;

    return (
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {rings.map((ring, idx) => {
              const r = baseRadius - idx * ringSpacing;
              const circ = 2 * Math.PI * r;
              const offset = circ - (circ * Math.min(100, Math.max(0, ring.percent))) / 100;
              return (
                <g key={ring.label || idx}>
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    fill="transparent"
                    stroke={isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    cx={center}
                    cy={center}
                    r={r}
                    fill="transparent"
                    stroke={ring.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-950 dark:text-white font-display tracking-tight">
              {centerValue}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-[#5a7b9c] uppercase tracking-wider mt-0.5">
              {title}
            </span>
          </div>
        </div>

        {/* Legend for the concentric rings */}
        <div className="space-y-3 min-w-[160px]">
          {rings.map((ring) => (
            <div key={ring.label} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ring.color }} />
                <span className="text-slate-600 dark:text-[#8daecf] font-medium">{ring.label}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white font-display">{ring.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single Ring Circular Gauge Tracker
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(100, Math.max(0, percentage))) / 100;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}
          strokeWidth={strokeWidth}
        />
        {/* Active progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#grad-${title.replace(/\s+/g, '')})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <span className="text-2xl font-black text-slate-950 dark:text-white font-display tracking-tight">
          {centerValue}
        </span>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-[#5a7b9c] uppercase tracking-wider mt-0.5">
          {title}
        </span>
        <span className="text-[10px] font-medium text-emerald-600 dark:text-[#10b981] mt-0.5">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
