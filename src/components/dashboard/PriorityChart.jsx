'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import Card from '@/components/common/Card';

const PRIORITY_COLORS = {
  High:   { fill: '#ef4444', bg: 'bg-rose-500',   text: 'text-rose-500'   },
  Medium: { fill: '#f59e0b', bg: 'bg-amber-500',  text: 'text-amber-500'  },
  Low:    { fill: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-500' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-2.5 shadow-xl text-white text-xs">
        <p className="font-bold">{label} Priority</p>
        <p className="text-slate-300 mt-0.5">{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

export default function PriorityChart({ high = 0, medium = 0, low = 0 }) {
  const data = [
    { name: 'High',   count: high,   fill: PRIORITY_COLORS.High.fill   },
    { name: 'Medium', count: medium, fill: PRIORITY_COLORS.Medium.fill },
    { name: 'Low',    count: low,    fill: PRIORITY_COLORS.Low.fill    },
  ];

  const total = high + medium + low;

  return (
    <Card title="Priority Distribution" subtitle="Tasks categorized by priority level">
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,245,249,0.06)' }} />
            <Bar dataKey="count" radius={[10, 10, 0, 0]} maxBarSize={52}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary pills */}
      <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {item.name}
            </span>
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
              {item.count}
            </span>
          </div>
        ))}
        {total > 0 && (
          <div className="ml-auto text-[11px] font-semibold text-slate-400">
            Total: <span className="text-slate-700 dark:text-slate-300 font-extrabold">{total}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
