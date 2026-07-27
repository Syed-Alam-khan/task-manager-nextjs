'use client';

import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Skeleton from '@/components/common/Skeleton';
import { formatTimeAgo } from '@/utils/formatters';
import { useNotification } from '@/context/NotificationContext';
import {
  IoNotificationsOutline,
  IoCheckmarkDoneOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-600 text-white rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Stay up-to-date with your automated task reminders and updates
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              icon={IoCheckmarkDoneOutline}
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-3">
            <Skeleton count={4} height="80px" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No Notifications"
            description="You are all caught up! No notifications to display."
            icon={IoNotificationsOutline}
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <Card
                key={item._id}
                className={`transition-all duration-200 ${
                  !item.isRead
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50 shadow-xs'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 overflow-hidden">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                        !item.isRead
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <IoNotificationsOutline className="text-xl" />
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {item.message}
                      </p>
                      <span className="text-[11px] font-medium text-slate-400 mt-2 block">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!item.isRead && (
                      <button
                        onClick={() => markAsRead(item._id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        title="Mark as read"
                      >
                        <IoCheckmarkCircleOutline className="text-xl" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(item._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Delete notification"
                    >
                      <IoTrashOutline className="text-xl" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
