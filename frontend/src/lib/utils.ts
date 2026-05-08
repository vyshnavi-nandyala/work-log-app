import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import type { Priority, Status } from './types';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatMinutes = (minutes: number | null | undefined): string => {
  if (!minutes) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const formatSeconds = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
};

export const formatDate = (date: string | Date): string =>
  format(new Date(date), 'MMM d, yyyy');

export const formatDateTime = (date: string | Date): string =>
  format(new Date(date), 'MMM d, yyyy HH:mm');

export const formatTime = (date: string | Date): string =>
  format(new Date(date), 'HH:mm');

export const formatRelative = (date: string | Date): string =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const toLocalISOString = (date: Date): string => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  high: { label: 'High', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  low: { label: 'Low', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
};

export const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  on_hold: { label: 'On Hold', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
};
