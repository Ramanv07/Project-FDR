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

export default function MaturityChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <p className="text-xs text-gray-500 py-8 text-center">No maturity distribution data available.</p>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceae6" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#656d76' }}
            axisLine={{ stroke: '#d6d3cd' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#656d76' }}
            axisLine={{ stroke: '#d6d3cd' }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: '#f5f4f2' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white border border-hairline rounded p-2 text-xs shadow-xs">
                    <p className="font-medium text-gray-900">{item.month}</p>
                    <p className="text-gray-600 mt-0.5">
                      Maturing FDRs: <span className="font-semibold">{item.count}</span>
                    </p>
                    <p className="text-gray-500 text-[11px]">
                      Sum: {formatIndianCurrency(item.totalAmount)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" fill="#1F3A5F" radius={[0, 0, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
