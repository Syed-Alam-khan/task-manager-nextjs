import axiosInstance from './axiosInstance';

export const calendarService = {
  async getCalendarEvents() {
    const response = await axiosInstance.get('/calendar');
    return response.data;
  },
};

export default calendarService;
