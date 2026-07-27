'use client';

import React from 'react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatDate } from '@/utils/formatters';
import { IoPencilOutline, IoTrashOutline, IoCalendarOutline } from 'react-icons/io5';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const getStatusVariant = (status) => {
    if (status === 'Completed') return 'success';
    if (status === 'In Progress') return 'primary';
    return 'warning';
  };

  const getPriorityVariant = (priority) => {
    if (priority === 'High') return 'danger';
    if (priority === 'Medium') return 'warning';
    return 'info';
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <input
            type="checkbox"
            checked={task.completed || task.status === 'Completed'}
            onChange={(e) =>
              onStatusChange(task._id, e.target.checked ? 'Completed' : 'Pending')
            }
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer shrink-0"
          />
          <h4
            className={`text-base font-bold text-slate-900 dark:text-slate-100 truncate ${
              task.completed || task.status === 'Completed'
                ? 'line-through text-slate-400 dark:text-slate-500'
                : ''
            }`}
          >
            {task.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <IoPencilOutline className="text-base" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <IoTrashOutline className="text-base" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
          <Badge variant={getStatusVariant(task.status)}>
            {task.status}
          </Badge>
          {task.category && (
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{
                backgroundColor: `${task.category.color}15`,
                color: task.category.color,
              }}
            >
              {task.category.name}
            </span>
          )}
        </div>

        {task.dueDate && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <IoCalendarOutline /> {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </Card>
  );
}
