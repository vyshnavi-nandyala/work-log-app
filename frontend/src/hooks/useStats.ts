'use client';
import { useState, useEffect } from 'react';
import { statsApi } from '@/lib/api';
import type { Stats } from '@/lib/types';

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await statsApi.get();
      setStats(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return { stats, loading, error, refetch: fetchStats };
};
