'use client';
import { useState } from 'react';
import { Clock, CheckCircle, TrendingUp, Target, Activity, Award } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import Timer from '@/components/dashboard/Timer';
import RecentLogs from '@/components/dashboard/RecentLogs';
import TimeByCategory from '@/components/charts/TimeByCategory';
import DailyTrends from '@/components/charts/DailyTrends';
import AddLogModal from '@/components/logs/AddLogModal';
import { useStats } from '@/hooks/useStats';
import { useWorkLogs } from '@/hooks/useWorkLogs';
import { useStore } from '@/store/useStore';
import { formatMinutes } from '@/lib/utils';
import { StatsCardSkeleton, ChartSkeleton } from '@/components/common/LoadingSkeleton';

export default function Dashboard() {
  const { stats, loading: statsLoading, refetch: refetchStats } = useStats();
  const { logs, loading: logsLoading, refetch: refetchLogs } = useWorkLogs({ limit: 50 } as never);
  const { sidebarOpen } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleRefresh = () => {
    refetchStats();
    refetchLogs();
  };

  const categoryBreakdown = (() => {
    const map = new Map<string, { category: { id: string; name: string; color: string; icon: string }; totalMinutes: number; taskCount: number }>();
    logs.forEach(log => {
      if (!log.category) return;
      const key = log.category.id;
      const existing = map.get(key);
      if (existing) {
        existing.totalMinutes += log.durationMinutes || 0;
        existing.taskCount += 1;
      } else {
        map.set(key, { category: log.category, totalMinutes: log.durationMinutes || 0, taskCount: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalMinutes - a.totalMinutes);
  })();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'} p-6`}>
        <Header
          title="Dashboard"
          subtitle="Track and analyze your work sessions"
          action={{ label: 'Log Work', onClick: () => setShowAddModal(true) }}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => <StatsCardSkeleton key={i} />)
          ) : (
            <>
              <StatsCard title="Today" value={formatMinutes(stats?.todayMinutes)} subtitle="hours logged" icon={Clock} iconColor="blue" />
              <StatsCard title="This Week" value={formatMinutes(stats?.weekMinutes)} subtitle="hours logged" icon={Activity} iconColor="violet" />
              <StatsCard title="This Month" value={formatMinutes(stats?.monthMinutes)} subtitle="hours logged" icon={TrendingUp} iconColor="indigo" />
              <StatsCard title="Avg / Day" value={formatMinutes(stats?.avgMinutesPerDay)} subtitle="this month" icon={Target} iconColor="cyan" />
              <StatsCard
                title="Completion Rate"
                value={`${stats?.taskCompletionRate ?? 0}%`}
                subtitle={`${stats?.completedTasks ?? 0} of ${stats?.totalTasks ?? 0} tasks`}
                icon={CheckCircle}
                iconColor="green"
              />
              <StatsCard title="Top Category" value={stats?.mostActiveCategory ?? 'N/A'} subtitle="by time spent" icon={Award} iconColor="amber" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-1">
            <Timer onLogCreated={handleRefresh} />
          </div>
          <div className="xl:col-span-2">
            {logsLoading ? <ChartSkeleton height={220} /> : <DailyTrends logs={logs} />}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {logsLoading ? <ChartSkeleton height={300} /> : <RecentLogs logs={logs} />}
          </div>
          <div className="xl:col-span-1">
            {logsLoading ? <ChartSkeleton height={300} /> : <TimeByCategory data={categoryBreakdown} />}
          </div>
        </div>

        <AddLogModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleRefresh}
        />
      </main>
    </div>
  );
}
