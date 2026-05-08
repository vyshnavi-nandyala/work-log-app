'use client';
import { useState, useEffect } from 'react';
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/lib/types';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const createCategory = async (data: { name: string; color: string; icon: string }) => {
    try {
      const res = await categoriesApi.create(data);
      setCategories(prev => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Category created');
      return res.data;
    } catch {
      toast.error('Failed to create category');
    }
  };

  const updateCategory = async (id: string, data: { name: string; color: string; icon: string }) => {
    try {
      const res = await categoriesApi.update(id, data);
      setCategories(prev => prev.map(c => c.id === id ? res.data : c));
      toast.success('Category updated');
    } catch {
      toast.error('Failed to update category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return { categories, loading, createCategory, updateCategory, deleteCategory, refetch: fetchCategories };
};
