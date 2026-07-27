import axiosInstance from './axiosInstance';

export const notificationService = {
  async getNotifications() {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  async markAsRead(id) {
    const response = await axiosInstance.put(`/notifications/${id}`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await axiosInstance.put('/notifications/read-all');
    return response.data;
  },

  async deleteNotification(id) {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
