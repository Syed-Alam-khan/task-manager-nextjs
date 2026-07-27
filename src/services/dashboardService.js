import axiosInstance from './axiosInstance';

export const dashboardService = {
  async getStats() {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },
};

export default dashboardService;
