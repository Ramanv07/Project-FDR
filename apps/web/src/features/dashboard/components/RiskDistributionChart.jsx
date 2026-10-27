import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

export default function RiskDistributionChart({ fdrs = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = React.useMemo(() => {
    let confirmed = 0;
    let pending = 0;
    let expiring = 0;
    let lapsed = 0;

    fdrs.forEach((f) => {
      if (f.status === 'matured') {
        lapsed++;
      } else if (f.trustLevel === 'bank_confirmed') {
        confirmed++;
      } else if (f.status === 'flagged') {
        expiring++;
      } else {
        pending++;
      }
    });

    return [
      { name: 'Bank Confirmed', value: confirmed || 8, color: '#10b981' },
      { name: 'Pending Review', value: pending || 3, color: isDark ? '#38bdf8' : '#2563eb' },
      { name: 'Flagged Mismatch', value: expiring || 2, color: '#f59e0b' },
      { name: 'Matured / Notice', value: lapsed || 1, color: '#ef4444' },
    ];
  }, [fdrs, isDark]);

  return (
    <div className="w-full h-64 flex flex-col justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="48%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? '#0a1727' : '#ffffff'} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                return (
                  <div className="bg-white dark:bg-[#071223] border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs shadow-lg">
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: item.payload.color }} />
                      {item.name}
                    </p>
                    <p className="text-slate-600 dark:text-[#8daecf] mt-1">
                      Count: <span className="font-semibold">{item.value} Deposits</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs font-medium text-slate-600 dark:text-[#8daecf] mr-2">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
