'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { WorkLog } from '@/lib/types';
import { formatMinutes, formatRelative } from '@/lib/utils';
import { StatusBadge, CategoryBadge } from '@/components/common/Badge';

interface Props {
  logs: WorkLog[];
}

export default function RecentLogs({ logs }: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between p-5 border-b border-[#2a2d3a]">
        <h2 className="font-semibold text-slate-200">Recent Activity</h2>
        <Link href="/logs" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-[#2a2d3a]">
        {logs.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No recent activity</p>
        ) : (
          logs.slice(0, 6).map(log => (
            <div key={log.id} className="flex items-center justify-between p-4 hover:bg-[#22253a] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-200 truncate">{log.taskName}</p>
                  <StatusBadge status={log.status} />
                </div>
                <div className="flex items-center gap-2">
                  {log.category && <CategoryBadge {...log.category} />}
                  <span className="text-xs text-slate-600">{formatRelative(log.startTime)}</span>
                </div>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="text-sm font-semibold text-slate-300">{formatMinutes(log.durationMinutes)}</p>
                {log.project && <p className="text-xs text-slate-600 mt-0.5">{log.project}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
