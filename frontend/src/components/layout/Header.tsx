'use client';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 hidden sm:block">
          {format(new Date(), 'EEEE, MMMM d yyyy')}
        </span>
        {action && (
          <button onClick={action.onClick} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
