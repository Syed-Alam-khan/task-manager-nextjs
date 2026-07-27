import axiosInstance from './axiosInstance';

export const profileService = {
  async getProfile() {
    const response = await axiosInstance.get('/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await axiosInstance.put('/profile', profileData);
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await axiosInstance.put('/profile/change-password', passwordData);
    return response.data;
  },
};

export default profileService;
