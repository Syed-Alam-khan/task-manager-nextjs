'use client';

import React from 'react';

const colorConfig = {
  indigo: {
    gradient: 'from-indigo-500 to-indigo-600',
    glow: 'shadow-indigo-500/25',
    softBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    softText: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-100 dark:ring-indigo-900/50',
    dot: 'bg-indigo-400',
    bar: 'from-indigo-400 to-indigo-600',
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/25',
    softBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    softText: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-100 dark:ring-emerald-900/50',
    dot: 'bg-emerald-400',
    bar: 'from-emerald-400 to-emerald-600',
  },
  amber: {
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/25',
    softBg: 'bg-amber-50 dark:bg-amber-950/40',
    softText: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-100 dark:ring-amber-900/50',
    dot: 'bg-amber-400',
    bar: 'from-amber-400 to-orange-500',
  },
  sky: {
    gradient: 'from-sky-500 to-cyan-500',
    glow: 'shadow-sky-500/25',
    softBg: 'bg-sky-50 dark:bg-sky-950/40',
    softText: 'text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-100 dark:ring-sky-900/50',
    dot: 'bg-sky-400',
    bar: 'from-sky-400 to-cyan-500',
  },
  rose: {
    gradient: 'from-rose-500 to-rose-600',
    glow: 'shadow-rose-500/25',
    softBg: 'bg-rose-50 dark:bg-rose-950/40',
    softText: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-100 dark:ring-rose-900/50',
    dot: 'bg-rose-400',
    bar: 'from-rose-400 to-rose-600',
  },
  purple: {
    gradient: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/25',
    softBg: 'bg-purple-50 dark:bg-purple-950/40',
    softText: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-100 dark:ring-purple-900/50',
    dot: 'bg-purple-400',
    bar: 'from-purple-400 to-violet-600',
  },
};

export default function SummaryCard({ title, value, icon: Icon, color = 'indigo', subtitle }) {
  const cfg = colorConfig[color] || colorConfig.indigo;

  return (
    <div
      className={`
        relative overflow-hidden
        bg-white dark:bg-slate-900
        border border-slate-200/70 dark:border-slate-800
        rounded-2xl p-5
        shadow-sm hover:shadow-lg ${cfg.glow}
        transition-all duration-300
        group cursor-default
      `}
    >
      {/* Decorative gradient blob in top-right */}
      <div
        className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${cfg.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1.5 leading-none tabular-nums">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon bubble */}
        <div
          className={`
            w-11 h-11 rounded-xl shrink-0
            bg-gradient-to-br ${cfg.gradient}
            flex items-center justify-center
            shadow-md ${cfg.glow}
            group-hover:scale-110 transition-transform duration-300
          `}
        >
          <Icon className="text-xl text-white drop-shadow-sm" />
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="mt-4 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full w-2/3 rounded-full bg-gradient-to-r ${cfg.bar} opacity-70`}
        />
      </div>
    </div>
  );
}
