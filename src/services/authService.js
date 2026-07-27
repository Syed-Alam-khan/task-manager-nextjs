import axiosInstance from './axiosInstance';

export const authService = {
  async login(credentials) {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  async getProfile(options = {}) {
    const response = await axiosInstance.get('/profile', options);
    return response.data;
  },
};

export default authService;
