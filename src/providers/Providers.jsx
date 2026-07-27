'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { TaskProvider } from '@/context/TaskContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { CalendarProvider } from '@/context/CalendarContext';
import { ProfileProvider } from '@/context/ProfileContext';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardProvider>
          <CategoryProvider>
            <TaskProvider>
              <NotificationProvider>
                <CalendarProvider>
                  <ProfileProvider>
                    {children}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        className: '!bg-white dark:!bg-slate-800 !text-slate-800 dark:!text-slate-100 !shadow-lg !rounded-xl !border !border-slate-100 dark:!border-slate-700 text-sm font-medium',
                      }}
                    />
                  </ProfileProvider>
                </CalendarProvider>
              </NotificationProvider>
            </TaskProvider>
          </CategoryProvider>
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
