'use client';

import React, { useState } from 'react';
import {
  IoChevronBack,
  IoChevronForward,
  IoCalendarOutline,
} from 'react-icons/io5';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TaskCalendar({ events = [], onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Map events to date strings YYYY-MM-DD
  const eventsByDate = {};
  events.forEach((evt) => {
    if (!evt.start) return;
    const dateStr = evt.start.split('T')[0];
    if (!eventsByDate[dateStr]) {
      eventsByDate[dateStr] = [];
    }
    eventsByDate[dateStr].push(evt);
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Calendar cells generation
  const cells = [];

  // Previous month padding days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    cells.push({ dayNum, isCurrentMonth: false, dateStr: '' });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    cells.push({ dayNum: d, isCurrentMonth: true, dateStr });
  }

  // Remaining padding for 42-cell grid (6 rows of 7)
  const totalCellsSoFar = cells.length;
  const remaining = 35 - totalCellsSoFar >= 0 ? 35 - totalCellsSoFar : 42 - totalCellsSoFar;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ dayNum: i, isCurrentMonth: false, dateStr: '' });
  }

  return (
    <div className="w-full select-none">
      {/* Calendar Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <IoCalendarOutline className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {events.length} total scheduled tasks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Previous Month"
            >
              <IoChevronBack className="text-base" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Next Month"
            >
              <IoChevronForward className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        {DAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((cell, index) => {
          const isToday = cell.dateStr === todayStr;
          const dayEvents = cell.dateStr ? eventsByDate[cell.dateStr] || [] : [];

          return (
            <div
              key={index}
              className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-start ${
                !cell.isCurrentMonth
                  ? 'bg-slate-50/40 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/40 opacity-40'
                  : isToday
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700/80 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : cell.isCurrentMonth
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400'
                  }`}
                >
                  {cell.dayNum}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event Pills */}
              <div className="space-y-1 overflow-y-auto max-h-[65px] custom-scrollbar">
                {dayEvents.map((evt) => {
                  const color =
                    evt.category?.color ||
                    (evt.priority === 'High'
                      ? '#ef4444'
                      : evt.priority === 'Medium'
                      ? '#f59e0b'
                      : '#10b981');

                  return (
                    <div
                      key={evt.id || evt._id}
                      onClick={() => onEventClick && onEventClick(evt)}
                      style={{
                        backgroundColor: `${color}20`,
                        borderLeftColor: color,
                      }}
                      className="px-2 py-1 rounded-lg border-l-3 text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate cursor-pointer hover:scale-[1.02] transition-transform"
                      title={evt.title}
                    >
                      {evt.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
