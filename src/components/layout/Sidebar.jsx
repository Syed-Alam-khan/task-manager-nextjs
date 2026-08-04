'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IoGridOutline,
  IoGrid,
  IoCheckmarkDoneCircleOutline,
  IoCheckmarkDoneCircle,
  IoFolderOpenOutline,
  IoFolderOpen,
  IoNotificationsOutline,
  IoNotifications,
  IoCalendarOutline,
  IoCalendar,
  IoPersonOutline,
  IoPerson,
  IoLogOutOutline,
  IoChevronBack,
  IoChevronForward,
  IoCheckmarkCircle,
} from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: IoGridOutline, activeIcon: IoGrid },
  { name: 'Tasks', href: '/tasks', icon: IoCheckmarkDoneCircleOutline, activeIcon: IoCheckmarkDoneCircle },
  { name: 'Categories', href: '/categories', icon: IoFolderOpenOutline, activeIcon: IoFolderOpen },
  { name: 'Notifications', href: '/notifications', icon: IoNotificationsOutline, activeIcon: IoNotifications },
  { name: 'Calendar', href: '/calendar', icon: IoCalendarOutline, activeIcon: IoCalendar },
  { name: 'Profile', href: '/profile', icon: IoPersonOutline, activeIcon: IoPerson },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80">
            <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <IoCheckmarkCircle className="text-2xl" />
              </div>
              {!collapsed && (
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap">
                  TodoList
                </span>
              )}
            </Link>

            {/* Collapse Toggle for Desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <IoChevronForward className="text-lg" /> : <IoChevronBack className="text-lg" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={`text-xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {!collapsed && (
                    <span className="whitespace-nowrap tracking-wide">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
          {!collapsed && user && (
            <div className="px-3.5 py-2.5 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title={collapsed ? 'Logout' : undefined}
          >
            <IoLogOutOutline className="text-xl shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
