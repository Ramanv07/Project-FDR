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

export default function InstitutionDepositChart({ fdrs = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = React.useMemo(() => {
    if (!fdrs || fdrs.length === 0) {
      return [
        { name: 'SBI', amount: 3500000, label: '₹35 Lakh' },
        { name: 'PNB', amount: 2500000, label: '₹25 Lakh' },
        { name: 'HDFC', amount: 5000000, label: '₹50 Lakh' },
        { name: 'Canara', amount: 1500000, label: '₹15 Lakh' },
      ];
    }

    const bankMap = {};
    fdrs.forEach((f) => {
      const bank = f.bank || 'National Bank';
      const shortName = bank.split(' ')[0];
      bankMap[shortName] = (bankMap[shortName] || 0) + (Number(f.amount) || 0);
    });

    return Object.entries(bankMap).map(([name, amount]) => ({
      name,
      amount,
      label: formatIndianCurrency(amount),
    }));
  }, [fdrs]);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(56, 189, 248, 0.08)' : '#e2e8f0'} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: isDark ? '#8daecf' : '#64748b' }}
            axisLine={{ stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: isDark ? '#8daecf' : '#64748b' }}
            axisLine={{ stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1' }}
            tickLine={false}
            tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-[#071223] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs shadow-lg">
                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-emerald-600 dark:text-[#10b981] font-semibold mt-1">
                      Pledged Principal: {formatIndianCurrency(item.amount)}
                    </p>
                    <p className="text-slate-500 dark:text-[#8daecf] text-[11px] mt-0.5">
                      Statutory Lien: Member Secretary, AICTE
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="amount"
            fill={isDark ? '#10b981' : '#059669'}
            radius={[6, 6, 0, 0]}
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
