'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import dashboardService from '@/services/dashboardService';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState({
    summary: {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      highPriorityTasks: 0,
      completionRate: 0,
    },
    recentTasks: [],
    recentNotifications: [],
    upcomingTasks: [],
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getStats();
      if (data.success) {
        setStats(data.stats || data.data || data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        loading,
        error,
        fetchStats,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
