'use client';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No entries yet',
  description = 'Get started by adding your first work log.',
  action,
  icon = <FileText className="w-10 h-10 text-slate-600" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#22253a] border border-[#2a2d3a] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mb-6">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </div>
  );
}
