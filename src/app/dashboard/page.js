'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import StatusChart from '@/components/dashboard/StatusChart';
import PriorityChart from '@/components/dashboard/PriorityChart';
import RecentTasksWidget from '@/components/dashboard/RecentTasksWidget';
import RecentNotificationsWidget from '@/components/dashboard/RecentNotificationsWidget';
import QuickActionsWidget from '@/components/dashboard/QuickActionsWidget';
import Skeleton from '@/components/common/Skeleton';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';

import { useDashboard } from '@/context/DashboardContext';
import { useTask } from '@/context/TaskContext';
import { useNotification } from '@/context/NotificationContext';
import { useCategory } from '@/context/CategoryContext';
import { useAuth } from '@/context/AuthContext';

import {
  IoCheckmarkDoneCircleOutline,
  IoTimeOutline,
  IoHourglassOutline,
  IoFlameOutline,
  IoPieChartOutline,
  IoListOutline,
  IoSparklesOutline,
} from 'react-icons/io5';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading: statsLoading, fetchStats } = useDashboard();
  const { tasks, fetchTasks, createTask, loading: taskLoading } = useTask();
  const { notifications, fetchNotifications } = useNotification();
  const { categories, fetchCategories } = useCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    category: '',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchTasks({ limit: 5 });
    fetchNotifications();
    fetchCategories();
  }, [fetchStats, fetchTasks, fetchNotifications, fetchCategories]);

  const handleFormChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title) return;
    setIsSubmitting(true);
    try {
      await createTask(taskForm);
      setIsModalOpen(false);
      setTaskForm({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        category: '',
        dueDate: '',
      });
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryData = stats?.summary || stats || {};

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <DashboardLayout>
      <div className="space-y-7">

        {/* ── Welcome Banner ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-7 sm:p-10 text-white shadow-2xl shadow-indigo-500/20">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-8 -right-8 w-56 h-56 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <IoSparklesOutline className="text-indigo-300 text-base" />
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
                  {getGreeting()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {user?.name || 'User'} 👋
              </h1>
              <p className="text-sm text-indigo-200/80 mt-2 max-w-md leading-relaxed">
                Here&rsquo;s a live snapshot of your workspace. Stay on top of your tasks and hit your goals!
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="bg-white/95 text-indigo-700 hover:bg-white hover:shadow-lg font-bold self-start sm:self-center shrink-0 rounded-2xl px-6 py-3 transition-all duration-200"
            >
              + New Task
            </Button>
          </div>
        </div>

        {/* ── KPI Summary Cards ───────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-5 animate-pulse"
              >
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-full mb-3" />
                <div className="h-8 w-12 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
                <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
            ))
          ) : (
            <>
              <SummaryCard title="Total Tasks"   value={summaryData.totalTasks ?? 0}          icon={IoListOutline}                    color="indigo"  />
              <SummaryCard title="Completed"     value={summaryData.completedTasks ?? 0}       icon={IoCheckmarkDoneCircleOutline}     color="emerald" />
              <SummaryCard title="In Progress"   value={summaryData.inProgressTasks ?? 0}      icon={IoHourglassOutline}               color="sky"     />
              <SummaryCard title="Pending"       value={summaryData.pendingTasks ?? 0}          icon={IoTimeOutline}                    color="amber"   />
              <SummaryCard title="High Priority" value={summaryData.highPriorityTasks ?? 0}    icon={IoFlameOutline}                   color="rose"    />
              <SummaryCard
                title="Completion"
                value={`${summaryData.completionRate ?? 0}%`}
                icon={IoPieChartOutline}
                color="purple"
                subtitle="Target: 100%"
              />
            </>
          )}
        </div>

        {/* ── Quick Shortcuts ─────────────────────────────────── */}
        <QuickActionsWidget onNewTask={() => setIsModalOpen(true)} />

        {/* ── Recharts Analytics Section ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusChart
            completed={summaryData.completedTasks ?? 0}
            inProgress={summaryData.inProgressTasks ?? 0}
            pending={summaryData.pendingTasks ?? 0}
          />
          <PriorityChart
            high={summaryData.highPriorityTasks ?? 0}
            medium={summaryData.mediumPriorityTasks ?? 0}
            low={summaryData.lowPriorityTasks ?? 0}
          />
        </div>

        {/* ── Recent Tasks & Notifications ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTasksWidget tasks={tasks} />
          </div>
          <div>
            <RecentNotificationsWidget notifications={notifications} />
          </div>
        </div>
      </div>

      {/* ── Quick Create Task Modal ──────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        size="md"
      >
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Task Title"
            name="title"
            placeholder="e.g. Design Landing Page"
            value={taskForm.title}
            onChange={handleFormChange}
            required
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Detailed task description..."
            value={taskForm.description}
            onChange={handleFormChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Priority" name="priority" value={taskForm.priority} onChange={handleFormChange} options={['Low', 'Medium', 'High']} />
            <Select label="Status"   name="status"   value={taskForm.status}   onChange={handleFormChange} options={['Pending', 'In Progress', 'Completed']} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={taskForm.category}
              onChange={handleFormChange}
              placeholder="Select Category"
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
            />
            <Input label="Due Date" name="dueDate" type="date" value={taskForm.dueDate} onChange={handleFormChange} />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>Create Task</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
