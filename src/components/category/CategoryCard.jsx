'use client';

import React from 'react';
import Card from '@/components/common/Card';
import { IoPencilOutline, IoTrashOutline, IoFolderOpenOutline } from 'react-icons/io5';

export default function CategoryCard({ category, onEdit, onDelete }) {
  const color = category.color || '#6366f1';

  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            <IoFolderOpenOutline className="text-xl sm:text-2xl" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              {category.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {color}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Edit category"
          >
            <IoPencilOutline className="text-base sm:text-lg" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            title="Delete category"
          >
            <IoTrashOutline className="text-base sm:text-lg" />
          </button>
        </div>
      </div>
    </Card>
  );
}
