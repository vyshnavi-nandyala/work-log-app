import axios from 'axios';
import type { WorkLog, WorkLogFormData, Category, Stats, Report, LogsResponse, LogFilters } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.error || err.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

type LogQuery = Partial<LogFilters> & { page?: number; limit?: number; sortBy?: string; sortOrder?: string };

export const logsApi = {
  getAll: (params?: LogQuery) =>
    api.get<{ success: boolean; data: WorkLog[]; pagination: LogsResponse['pagination'] }>('/api/logs', { params }).then(r => r.data),
  getById: (id: string) =>
    api.get<{ success: boolean; data: WorkLog }>(`/api/logs/${id}`).then(r => r.data),
  create: (data: WorkLogFormData) =>
    api.post<{ success: boolean; data: WorkLog }>('/api/logs', data).then(r => r.data),
  update: (id: string, data: WorkLogFormData) =>
    api.put<{ success: boolean; data: WorkLog }>(`/api/logs/${id}`, data).then(r => r.data),
  delete: (id: string) =>
    api.delete<{ success: boolean }>(`/api/logs/${id}`).then(r => r.data),
  export: (filters?: Partial<LogFilters>, format = 'csv') =>
    api.post('/api/logs/export', { ...filters, format }, { responseType: format === 'csv' ? 'blob' : 'json' }).then(r => r.data),
};

export const categoriesApi = {
  getAll: () =>
    api.get<{ success: boolean; data: Category[] }>('/api/categories').then(r => r.data),
  create: (data: { name: string; color: string; icon: string }) =>
    api.post<{ success: boolean; data: Category }>('/api/categories', data).then(r => r.data),
  update: (id: string, data: { name: string; color: string; icon: string }) =>
    api.put<{ success: boolean; data: Category }>(`/api/categories/${id}`, data).then(r => r.data),
  delete: (id: string) =>
    api.delete<{ success: boolean }>(`/api/categories/${id}`).then(r => r.data),
};

export const statsApi = {
  get: () =>
    api.get<{ success: boolean; data: Stats }>('/api/stats').then(r => r.data),
};

export const reportsApi = {
  daily: (date?: string) =>
    api.get<{ success: boolean; data: Report }>('/api/reports/daily', { params: { date } }).then(r => r.data),
  weekly: (date?: string) =>
    api.get<{ success: boolean; data: Report }>('/api/reports/weekly', { params: { date } }).then(r => r.data),
  monthly: (date?: string) =>
    api.get<{ success: boolean; data: Report }>('/api/reports/monthly', { params: { date } }).then(r => r.data),
};

export default api;
