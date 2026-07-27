'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import calendarService from '@/services/calendarService';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCalendarEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calendarService.getCalendarEvents();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch calendar events');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        events,
        loading,
        error,
        fetchCalendarEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
