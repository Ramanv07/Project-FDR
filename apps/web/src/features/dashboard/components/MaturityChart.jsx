import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatIndianCurrency } from '../../../lib/format';
import { useTheme } from '../../../context/ThemeContext';

export default function MaturityChart({ data = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return <p className="text-xs text-gray-500 dark:text-slate-400 py-8 text-center">No maturity distribution data available.</p>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#eceae6'} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#656d76' }}
            axisLine={{ stroke: isDark ? '#334155' : '#d6d3cd' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#656d76' }}
            axisLine={{ stroke: isDark ? '#334155' : '#d6d3cd' }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: isDark ? '#1e293b80' : '#f5f4f2' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs shadow-md">
                    <p className="font-bold text-gray-900 dark:text-white">{item.month}</p>
                    <p className="text-gray-600 dark:text-slate-300 mt-0.5">
                      Maturing FDRs: <span className="font-semibold">{item.count}</span>
                    </p>
                    <p className="text-gray-500 dark:text-slate-400 text-[11px]">
                      Sum: {formatIndianCurrency(item.totalAmount)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" fill={isDark ? '#3b82f6' : '#1F3A5F'} radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
