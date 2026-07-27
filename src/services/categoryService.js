import axiosInstance from './axiosInstance';

export const categoryService = {
  async getCategories() {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  async createCategory(categoryData) {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
