'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatDate } from '@/utils/formatters';
import { IoArrowForward, IoCalendarOutline, IoEllipse } from 'react-icons/io5';

const STATUS_CONFIG = {
  Completed:   { variant: 'success',  dot: 'bg-emerald-500' },
  'In Progress': { variant: 'primary',  dot: 'bg-indigo-500'  },
  Pending:     { variant: 'warning',  dot: 'bg-amber-500'   },
};

const PRIORITY_CONFIG = {
  High:   'danger',
  Medium: 'warning',
  Low:    'info',
};

export default function RecentTasksWidget({ tasks = [] }) {
  const getStatusConfig = (status, completed) => {
    if (completed || status === 'Completed') return STATUS_CONFIG['Completed'];
    return STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  };

  return (
    <Card
      title="Recent Tasks"
      subtitle="Your latest created tasks"
      action={
        <Link
          href="/tasks"
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
        >
          View all
          <IoArrowForward className="text-sm group-hover:translate-x-0.5 transition-transform" />
        </Link>
      }
    >
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <IoCalendarOutline className="text-slate-300 dark:text-slate-600 text-xl" />
          </div>
          <p className="text-xs font-medium">No recent tasks found</p>
        </div>
      ) : (
        <div className="space-y-1">
          {tasks.slice(0, 5).map((task) => {
            const statusCfg = getStatusConfig(task.status, task.completed);
            const isComplete = task.completed || task.status === 'Completed';

            return (
              <div
                key={task._id}
                className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                {/* Status dot + title */}
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${statusCfg.dot}`} />
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold truncate transition-colors ${
                        isComplete
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.category && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide"
                          style={{ color: task.category?.color || '#94a3b8' }}
                        >
                          {task.category?.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <IoCalendarOutline className="text-xs" />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant={PRIORITY_CONFIG[task.priority] || 'info'}>{task.priority}</Badge>
                  <Badge variant={statusCfg.variant}>
                    {isComplete ? 'Done' : task.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
