'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '@/components/common/Card';

const COLORS = ['#10b981', '#6366f1', '#f59e0b'];
const LABELS = ['Completed', 'In Progress', 'Pending'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-2.5 shadow-xl text-white text-xs">
        <p className="font-bold">{payload[0].name}</p>
        <p className="text-slate-300 mt-0.5">{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function StatusChart({ completed = 0, inProgress = 0, pending = 0 }) {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending', value: pending },
  ].filter((item) => item.value > 0);

  const hasData = data.length > 0;
  const total = completed + inProgress + pending;

  return (
    <Card title="Task Status" subtitle="Overview of your current task progress">
      <div className="h-64 w-full flex items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[LABELS.indexOf(entry.name)]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: 'inherit', fontSize: '11px', fontWeight: 600 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-700" />
            <p className="text-xs font-medium">No task data yet</p>
          </div>
        )}
      </div>

      {/* Legend totals */}
      {hasData && (
        <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          {[
            { label: 'Completed', value: completed, color: '#10b981' },
            { label: 'In Progress', value: inProgress, color: '#6366f1' },
            { label: 'Pending', value: pending, color: '#f59e0b' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100" style={{ color: item.color }}>
                {item.value}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
