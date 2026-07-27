'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import { formatTimeAgo } from '@/utils/formatters';
import { IoNotificationsOutline, IoArrowForward, IoRadioButtonOn } from 'react-icons/io5';

export default function RecentNotificationsWidget({ notifications = [] }) {
  return (
    <Card
      title="Recent Activity"
      subtitle="Latest system &amp; task updates"
      action={
        <Link
          href="/notifications"
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
        >
          View all
          <IoArrowForward className="text-sm group-hover:translate-x-0.5 transition-transform" />
        </Link>
      }
    >
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <IoNotificationsOutline className="text-slate-300 dark:text-slate-600 text-xl" />
          </div>
          <p className="text-xs font-medium">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.slice(0, 5).map((notif) => (
            <div
              key={notif._id}
              className={`relative p-3 rounded-xl border transition-colors ${
                !notif.isRead
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50'
                  : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/60'
              }`}
            >
              {!notif.isRead && (
                <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
              <div className="flex items-start justify-between gap-2 pr-4">
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {notif.title}
                </h5>
                <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
                  {formatTimeAgo(notif.createdAt)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {notif.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
