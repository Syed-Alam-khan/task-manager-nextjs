'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskCard from '@/components/task/TaskCard';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Textarea from '@/components/common/Textarea';
import Modal from '@/components/common/Modal';
import ConfirmModal from '@/components/common/ConfirmModal';
import SearchInput from '@/components/common/SearchInput';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';
import Skeleton from '@/components/common/Skeleton';
import { formatDate } from '@/utils/formatters';

import { useTask } from '@/context/TaskContext';
import { useCategory } from '@/context/CategoryContext';

import {
  IoAddCircleOutline,
  IoCheckmarkDoneCircleOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoFunnelOutline,
} from 'react-icons/io5';

export default function TasksPage() {
  const {
    tasks,
    pagination,
    filters,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    searchTasks,
    filterTasks,
    changePage,
  } = useTask();

  const { categories, fetchCategories } = useCategory();

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    category: '',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    searchTasks(value);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Pending',
      category: '',
      dueDate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Medium',
      status: task.status || 'Pending',
      category: task.category?._id || task.category || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteTask(deleteTarget._id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusVariant = (status) => {
    if (status === 'Completed') return 'success';
    if (status === 'In Progress') return 'primary';
    return 'warning';
  };

  const getPriorityVariant = (priority) => {
    if (priority === 'High') return 'danger';
    if (priority === 'Medium') return 'warning';
    return 'info';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Tasks
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage, filter, and track all your workflow tasks
            </p>
          </div>
          <Button variant="primary" icon={IoAddCircleOutline} onClick={handleOpenCreate}>
            Create Task
          </Button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="w-full lg:w-72">
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              onClear={() => {
                setSearchInput('');
                searchTasks('');
              }}
              placeholder="Search by title..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <Select
              placeholder="All Statuses"
              value={filters.status || ''}
              onChange={(e) => filterTasks({ status: e.target.value })}
              options={['Pending', 'In Progress', 'Completed']}
              className="py-2 text-xs"
            />

            <Select
              placeholder="All Priorities"
              value={filters.priority || ''}
              onChange={(e) => filterTasks({ priority: e.target.value })}
              options={['Low', 'Medium', 'High']}
              className="py-2 text-xs"
            />

            <Select
              placeholder="All Categories"
              value={filters.category || ''}
              onChange={(e) => filterTasks({ category: e.target.value })}
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              className="py-2 text-xs"
            />
          </div>
        </div>

        {/* Desktop Table & Mobile Cards */}
        {loading ? (
          <div className="space-y-3">
            <Skeleton count={5} height="60px" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No Tasks Found"
            description="No tasks match your current criteria. Create a new task or adjust filters."
            icon={IoCheckmarkDoneCircleOutline}
            actionText="Create Task"
            onAction={handleOpenCreate}
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 w-10">Done</th>
                      <th className="py-3.5 px-4">Task Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Due Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {tasks.map((task) => (
                      <tr
                        key={task._id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={task.completed || task.status === 'Completed'}
                            onChange={(e) =>
                              updateTaskStatus(
                                task._id,
                                e.target.checked ? 'Completed' : 'Pending'
                              )
                            }
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <h4
                            className={`font-semibold text-slate-900 dark:text-slate-100 truncate ${
                              task.completed || task.status === 'Completed'
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : ''
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {task.category ? (
                            <span
                              className="px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: `${task.category.color}15`,
                                color: task.category.color,
                              }}
                            >
                              {task.category.name}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Uncategorized</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={getPriorityVariant(task.priority)}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                            options={['Pending', 'In Progress', 'Completed']}
                            className="py-1 px-2 text-xs !w-32 bg-transparent"
                          />
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(task.dueDate)}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(task)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <IoPencilOutline className="text-lg" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(task)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              <IoTrashOutline className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalTasks}
                limit={pagination.limit}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onPageChange={changePage}
              />
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={setDeleteTarget}
                  onStatusChange={updateTaskStatus}
                />
              ))}

              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalTasks}
                limit={pagination.limit}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onPageChange={changePage}
              />
            </div>
          </>
        )}
      </div>

      {/* Task Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Task Title"
            name="title"
            placeholder="e.g. Complete Project Proposal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Add details about this task..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={['Low', 'Medium', 'High']}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={['Pending', 'In Progress', 'Completed']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Select Category"
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
            />
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        loading={isSubmitting}
      />
    </DashboardLayout>
  );
}
