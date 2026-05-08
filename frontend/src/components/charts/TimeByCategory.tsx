'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatMinutes } from '@/lib/utils';
import type { CategoryBreakdown } from '@/lib/types';

interface Props {
  data: CategoryBreakdown[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="font-medium text-slate-200">{item.name}</p>
      <p style={{ color: item.payload.color }}>{formatMinutes(item.value)}</p>
    </div>
  );
};

export default function TimeByCategory({ data }: Props) {
  if (!data?.length) {
    return (
      <div className="card p-5">
        <h2 className="font-semibold text-slate-200 mb-4">Time by Category</h2>
        <div className="flex items-center justify-center h-[220px] text-slate-600 text-sm">No data yet</div>
      </div>
    );
  }

  const chartData = data.map(d => ({
    name: `${d.category.icon} ${d.category.name}`,
    value: d.totalMinutes,
    color: d.category.color,
    taskCount: d.taskCount,
  }));

  return (
    <div className="card p-5">
      <h2 className="font-semibold text-slate-200 mb-4">Time by Category</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-2">
        {chartData.slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-400">{item.name}</span>
            </div>
            <span className="text-slate-300 font-medium">{formatMinutes(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
