'use client';
import { useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { Download, Printer, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useStore } from '@/store/useStore';
import { reportsApi } from '@/lib/api';
import type { Report } from '@/lib/types';
import { formatMinutes } from '@/lib/utils';
import { ChartSkeleton } from '@/components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

type ReportType = 'daily' | 'weekly' | 'monthly';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-blue-400 font-semibold">{formatMinutes(payload[0]?.value)}</p>
    </div>
  );
};

export default function ReportsPage() {
  const { sidebarOpen } = useStore();
  const [type, setType] = useState<ReportType>('weekly');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let res;
      if (type === 'daily') res = await reportsApi.daily(date);
      else if (type === 'weekly') res = await reportsApi.weekly(date);
      else res = await reportsApi.monthly(date);
      setReport(res.data);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [type, date]);

  const handleExportCsv = () => {
    if (!report) return;
    const rows = report.logs.map(l => [
      `"${l.taskName}"`, `"${l.description || ''}"`, `"${l.project || ''}"`,
      `"${l.category?.name || ''}"`, l.startTime, l.endTime || '',
      l.durationMinutes || '', l.status, l.priority,
    ].join(','));
    const csv = ['Task,Description,Project,Category,Start,End,Duration(min),Status,Priority', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${type}-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  const chartData = report?.categoryBreakdown.map(d => ({
    name: `${d.category.icon} ${d.category.name}`,
    minutes: d.totalMinutes,
    color: d.category.color,
  })) || [];

  const quickDates = [
    { label: 'Today', date: format(new Date(), 'yyyy-MM-dd') },
    { label: 'Yesterday', date: format(subDays(new Date(), 1), 'yyyy-MM-dd') },
    { label: 'Last Week', date: format(subDays(new Date(), 7), 'yyyy-MM-dd') },
    { label: 'Last Month', date: format(subMonths(new Date(), 1), 'yyyy-MM-dd') },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'} p-6`}>
        <Header title="Reports" subtitle="Analyze your productivity patterns" />

        <div className="card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 bg-[#0f1117] rounded-lg p-1 border border-[#2a2d3a]">
              {(['daily', 'weekly', 'monthly'] as ReportType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${type === t ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <input type="date" className="input text-sm w-auto" value={date} onChange={e => setDate(e.target.value)} />
            </div>

            <div className="flex gap-1">
              {quickDates.map(q => (
                <button key={q.label} onClick={() => setDate(q.date)} className="btn-secondary text-xs py-1 px-2">{q.label}</button>
              ))}
            </div>

            <div className="ml-auto flex gap-2">
              <button onClick={handleExportCsv} className="btn-secondary flex items-center gap-1 text-sm">
                <Download className="w-4 h-4" />CSV
              </button>
              <button onClick={() => window.print()} className="btn-secondary flex items-center gap-1 text-sm">
                <Printer className="w-4 h-4" />Print
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => <ChartSkeleton key={i} height={100} />)}
          </div>
        ) : report && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="card p-5">
                <p className="text-slate-500 text-sm mb-1">Total Time</p>
                <p className="text-3xl font-bold text-blue-400">{formatMinutes(report.summary.totalMinutes)}</p>
              </div>
              <div className="card p-5">
                <p className="text-slate-500 text-sm mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-violet-400">{report.summary.totalTasks}</p>
              </div>
              <div className="card p-5">
                <p className="text-slate-500 text-sm mb-1">Avg per Task</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {formatMinutes(report.summary.totalTasks > 0 ? Math.round(report.summary.totalMinutes / report.summary.totalTasks) : 0)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="card p-5">
                <h2 className="font-semibold text-slate-200 mb-4">Time by Category</h2>
                {chartData.length === 0 ? (
                  <p className="text-slate-600 text-sm text-center py-8">No data for this period</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 40, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} angle={-25} textAnchor="end" />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => `${Math.round(v / 60)}h`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="card p-5">
                <h2 className="font-semibold text-slate-200 mb-4">Category Breakdown</h2>
                <div className="space-y-3">
                  {report.categoryBreakdown.length === 0 ? (
                    <p className="text-slate-600 text-sm text-center py-8">No data for this period</p>
                  ) : (
                    report.categoryBreakdown.map((item, i) => {
                      const pct = report.summary.totalMinutes > 0
                        ? Math.round((item.totalMinutes / report.summary.totalMinutes) * 100)
                        : 0;
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-400">
                              {item.category.icon} {item.category.name}
                            </span>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-500">{item.taskCount} tasks</span>
                              <span className="font-medium text-slate-300">{formatMinutes(item.totalMinutes)}</span>
                              <span className="text-slate-600 w-8 text-right">{pct}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#0f1117] overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.category.color }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between p-5 border-b border-[#2a2d3a]">
                <h2 className="font-semibold text-slate-200">Log Entries</h2>
                <span className="text-xs text-slate-600">{report.logs.length} entries</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-[#2a2d3a] bg-[#0f1117]">
                    <tr>
                      {['Task', 'Category', 'Duration', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2d3a]">
                    {report.logs.map(log => (
                      <tr key={log.id} className="hover:bg-[#22253a]">
                        <td className="px-4 py-3 text-sm text-slate-200">{log.taskName}</td>
                        <td className="px-4 py-3 text-sm text-slate-400">{log.category ? `${log.category.icon} ${log.category.name}` : '—'}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-300">{formatMinutes(log.durationMinutes)}</td>
                        <td className="px-4 py-3 text-sm text-slate-400 capitalize">{log.status.replace('_', ' ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
