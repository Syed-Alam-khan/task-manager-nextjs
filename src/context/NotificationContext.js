'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import notificationService from '@/services/notificationService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevIdsRef = useRef(new Set());
  const initialFetchDoneRef = useRef(false);

  const fetchNotifications = useCallback(async (isPolling = false) => {
    if (!user) return;
    if (!isPolling) setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      if (data.success) {
        const fetched = data.notifications || [];
        setNotifications(fetched);

        const unread = fetched.filter((n) => !n.isRead).length;
        setUnreadCount(unread);

        // Check for new notifications during polling
        if (initialFetchDoneRef.current && isPolling) {
          fetched.forEach((item) => {
            if (!prevIdsRef.current.has(item._id) && !item.isRead) {
              toast.custom(
                (t) => (
                  <div
                    className={`${
                      t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 p-4`}
                  >
                    <div className="flex-1 w-0">
                      <div className="flex items-start">
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
                { duration: 5000 }
              );
            }
          });
        }

        // Update active IDs ref
        prevIdsRef.current = new Set(fetched.map((n) => n._id));
        initialFetchDoneRef.current = true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [user]);

  // Handle Polling only after login
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      initialFetchDoneRef.current = false;
      prevIdsRef.current = new Set();
      return;
    }

    // Initial fetch when user becomes active
    fetchNotifications(false);

    // Setup 60000 ms polling interval
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const data = await notificationService.markAsRead(id);
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const data = await notificationService.markAllAsRead();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const data = await notificationService.deleteNotification(id);
      if (data.success) {
        setNotifications((prev) => {
          const target = prev.find((n) => n._id === id);
          if (target && !target.isRead) {
            setUnreadCount((c) => Math.max(0, c - 1));
          }
          return prev.filter((n) => n._id !== id);
        });
        toast.success('Notification deleted');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
