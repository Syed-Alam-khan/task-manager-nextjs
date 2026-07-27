'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import categoryService from '@/services/categoryService';
import toast from 'react-hot-toast';

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (categoryData) => {
    setLoading(true);
    try {
      const data = await categoryService.createCategory(categoryData);
      if (data.success) {
        toast.success(data.message || 'Category created');
        await fetchCategories();
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    try {
      const data = await categoryService.updateCategory(id, categoryData);
      if (data.success) {
        toast.success(data.message || 'Category updated');
        await fetchCategories();
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      const data = await categoryService.deleteCategory(id);
      if (data.success) {
        toast.success(data.message || 'Category deleted');
        await fetchCategories();
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}
