'use client';
import { useState, useEffect, useCallback } from 'react';
import { logsApi } from '@/lib/api';
import type { WorkLog, LogFilters, Pagination } from '@/lib/types';
import toast from 'react-hot-toast';

export const useWorkLogs = (initialFilters: Partial<LogFilters> = {}) => {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, pages: 0 });
  const [filters, setFilters] = useState<Partial<LogFilters>>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await logsApi.getAll(filters);
      setLogs(res.data);
      setPagination(res.pagination);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to fetch logs';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const deleteLog = async (id: string) => {
    try {
      await logsApi.delete(id);
      setLogs(prev => prev.filter(l => l.id !== id));
      toast.success('Work log deleted');
    } catch {
      toast.error('Failed to delete log');
    }
  };

  const updateFilters = (newFilters: Partial<LogFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => setFilters({});

  return { logs, pagination, loading, error, filters, updateFilters, clearFilters, refetch: fetchLogs, deleteLog };
};
