'use client';

import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {(title || subtitle || action) && (
        <div
          className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 ${headerClassName}`}
        >
          <div>
            {title && (
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
