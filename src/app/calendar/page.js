'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';
import Skeleton from '@/components/common/Skeleton';
import TaskCalendar from '@/components/calendar/TaskCalendar';
import { formatDate } from '@/utils/formatters';
import { useCalendar } from '@/context/CalendarContext';

export default function CalendarPage() {
  const { events, loading, fetchCalendarEvents } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  const handleEventClick = (eventObj) => {
    setSelectedEvent(eventObj);
  };

  const getPriorityVariant = (priority) => {
    if (priority === 'High') return 'danger';
    if (priority === 'Medium') return 'warning';
    return 'info';
  };

  const getStatusVariant = (status) => {
    if (status === 'Completed') return 'success';
    if (status === 'In Progress') return 'primary';
    return 'warning';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Calendar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual schedule and due dates of all your tasks
          </p>
        </div>

        {/* Calendar Card */}
        <Card className="p-4 sm:p-6 overflow-hidden">
          {loading ? (
            <Skeleton height="500px" />
          ) : (
            <TaskCalendar events={events} onEventClick={handleEventClick} />
          )}
        </Card>
      </div>

      {/* Task Details Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Task Details"
        size="sm"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Title
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {selectedEvent.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Status
                </span>
                <Badge variant={getStatusVariant(selectedEvent.status)}>
                  {selectedEvent.status || 'Pending'}
                </Badge>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Priority
                </span>
                <Badge variant={getPriorityVariant(selectedEvent.priority)}>
                  {selectedEvent.priority || 'Medium'}
                </Badge>
              </div>
            </div>

            {selectedEvent.category && (
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Category
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold inline-block"
                  style={{
                    backgroundColor: `${selectedEvent.category.color}15`,
                    color: selectedEvent.category.color,
                  }}
                >
                  {selectedEvent.category.name}
                </span>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Due Date
              </span>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatDate(selectedEvent.start)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
