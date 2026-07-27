'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import taskService from '@/services/taskService';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    totalTasks: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = { ...filters, ...customParams };
      // Clean up empty params
      Object.keys(queryParams).forEach(
        (key) => (queryParams[key] === '' || queryParams[key] === null) && delete queryParams[key]
      );

      const data = await taskService.getTasks(queryParams);
      if (data.success) {
        setTasks(data.tasks || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const data = await taskService.createTask(taskData);
      if (data.success) {
        toast.success(data.message || 'Task created');
        await fetchTasks();
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      const data = await taskService.updateTask(id, taskData);
      if (data.success) {
        toast.success(data.message || 'Task updated');
        await fetchTasks();
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const data = await taskService.updateTaskStatus(id, status);
      if (data.success) {
        toast.success(`Task status updated to ${status}`);
        await fetchTasks();
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const data = await taskService.deleteTask(id);
      if (data.success) {
        toast.success(data.message || 'Task deleted');
        await fetchTasks();
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchTasks = (searchQuery) => {
    const updated = { ...filters, search: searchQuery, page: 1 };
    setFilters(updated);
    fetchTasks(updated);
  };

  const filterTasks = (newFilters) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    fetchTasks(updated);
  };

  const changePage = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    fetchTasks(updated);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        pagination,
        filters,
        setFilters,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        searchTasks,
        filterTasks,
        changePage,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
