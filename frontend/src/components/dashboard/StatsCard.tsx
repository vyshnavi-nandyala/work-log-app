'use client';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: { value: number; label: string };
  className?: string;
}

export default function StatsCard({ title, value, subtitle, icon: Icon, iconColor, trend, className }: StatsCardProps) {
  return (
    <div className={cn('card p-5 hover:border-slate-600 transition-colors duration-200', className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', `bg-${iconColor}-500/10`)}>
          <Icon className={cn('w-5 h-5', `text-${iconColor}-400`)} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-100 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      {trend && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', trend.value >= 0 ? 'text-green-400' : 'text-red-400')}>
          <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span className="text-slate-600">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
