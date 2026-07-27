'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import {
  IoAddCircleOutline,
  IoFolderOpenOutline,
  IoCalendarOutline,
  IoCheckmarkDoneCircleOutline,
} from 'react-icons/io5';

const actions = [
  {
    label: 'New Task',
    icon: IoAddCircleOutline,
    isButton: true,
    colorClass:
      'border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50 to-indigo-100/60 dark:from-indigo-950/50 dark:to-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:from-indigo-100 hover:to-indigo-200/60 dark:hover:from-indigo-950/70 dark:hover:to-indigo-900/50',
    iconColor: 'text-indigo-500 dark:text-indigo-400',
  },
  {
    label: 'All Tasks',
    icon: IoCheckmarkDoneCircleOutline,
    href: '/tasks',
    colorClass:
      'border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-950/50 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:from-emerald-100 hover:to-emerald-200/60 dark:hover:from-emerald-950/70 dark:hover:to-emerald-900/50',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    label: 'Categories',
    icon: IoFolderOpenOutline,
    href: '/categories',
    colorClass:
      'border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/50 dark:to-amber-900/30 text-amber-700 dark:text-amber-300 hover:from-amber-100 hover:to-amber-200/60 dark:hover:from-amber-950/70 dark:hover:to-amber-900/50',
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
  {
    label: 'Calendar',
    icon: IoCalendarOutline,
    href: '/calendar',
    colorClass:
      'border-violet-200 dark:border-violet-900/60 bg-gradient-to-br from-violet-50 to-violet-100/60 dark:from-violet-950/50 dark:to-violet-900/30 text-violet-700 dark:text-violet-300 hover:from-violet-100 hover:to-violet-200/60 dark:hover:from-violet-950/70 dark:hover:to-violet-900/50',
    iconColor: 'text-violet-500 dark:text-violet-400',
  },
];

export default function QuickActionsWidget({ onNewTask }) {
  return (
    <Card title="Quick Actions" subtitle="Shortcuts for common operations">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const sharedClass = `flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border transition-all duration-200 group hover:scale-[1.02] hover:shadow-sm ${action.colorClass}`;

          if (action.isButton) {
            return (
              <button key={action.label} onClick={onNewTask} className={sharedClass}>
                <div className={`text-2xl ${action.iconColor} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon />
                </div>
                <span className="text-xs font-bold tracking-wide">{action.label}</span>
              </button>
            );
          }

          return (
            <Link key={action.label} href={action.href} className={sharedClass}>
              <div className={`text-2xl ${action.iconColor} transition-transform duration-200 group-hover:scale-110`}>
                <Icon />
              </div>
              <span className="text-xs font-bold tracking-wide">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
