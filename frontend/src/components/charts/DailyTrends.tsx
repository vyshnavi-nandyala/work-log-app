'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays } from 'date-fns';
import { formatMinutes } from '@/lib/utils';
import type { WorkLog } from '@/lib/types';

interface Props {
  logs: WorkLog[];
  days?: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-blue-400 font-semibold">{formatMinutes(payload[0]?.value)}</p>
    </div>
  );
};

export default function DailyTrends({ logs, days = 14 }: Props) {
  const data = Array.from({ length: days }, (_, i) => {
    const day = subDays(new Date(), days - 1 - i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayLogs = logs.filter(l => format(new Date(l.startTime), 'yyyy-MM-dd') === dayStr);
    const totalMinutes = dayLogs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
    return { date: format(day, 'MMM d'), minutes: totalMinutes };
  });

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-200">Daily Trends</h2>
        <span className="text-xs text-slate-600">Last {days} days</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            interval={Math.floor(days / 7)}
          />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={v => `${Math.round(v / 60)}h`} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#blueGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6', stroke: '#1a1d27', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
