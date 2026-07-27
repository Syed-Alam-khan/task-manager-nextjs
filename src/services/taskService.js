import axiosInstance from './axiosInstance';

export const taskService = {
  async getTasks(params = {}) {
    const response = await axiosInstance.get('/tasks', { params });
    return response.data;
  },

  async createTask(taskData) {
    const response = await axiosInstance.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await axiosInstance.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async updateTaskStatus(id, status) {
    const response = await axiosInstance.put(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async deleteTask(id) {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
