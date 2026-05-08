'use client';
import { cn } from '@/lib/utils';

const Skeleton = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={cn('animate-pulse bg-slate-800 rounded-lg', className)} style={style} />
);

export const StatsCardSkeleton = () => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-3 w-32" />
  </div>
);

export const LogRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-[#2a2d3a]">
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-4 w-16" />
    <Skeleton className="h-4 w-12" />
  </div>
);

export const ChartSkeleton = ({ height = 280 }: { height?: number }) => (
  <div className="card p-5">
    <Skeleton className="h-5 w-36 mb-4" />
    <Skeleton style={{ height }} className="w-full" />
  </div>
);

export default Skeleton;
