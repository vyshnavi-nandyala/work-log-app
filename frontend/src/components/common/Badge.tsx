'use client';
import { cn, priorityConfig, statusConfig } from '@/lib/utils';
import type { Priority, Status } from '@/lib/types';

export const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const cfg = priorityConfig[priority];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: Status }) => {
  const cfg = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  );
};

export const CategoryBadge = ({ name, color, icon }: { name: string; color: string; icon: string }) => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border"
    style={{ color, borderColor: `${color}30`, backgroundColor: `${color}15` }}
  >
    <span>{icon}</span>
    {name}
  </span>
);
