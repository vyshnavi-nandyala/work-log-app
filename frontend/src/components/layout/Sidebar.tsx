'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListTodo, BarChart3, Settings, Clock, PanelLeftClose, PanelLeftOpen, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/logs', icon: ListTodo, label: 'Work Logs' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useStore();

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-[#1a1d27] border-r border-[#2a2d3a] flex flex-col transition-all duration-300 z-40',
      sidebarOpen ? 'w-56' : 'w-16'
    )}>
      <div className="flex items-center justify-between p-4 border-b border-[#2a2d3a] h-16">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-200 text-sm">WorkLog</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn('text-slate-500 hover:text-slate-300 transition-colors', !sidebarOpen && 'mx-auto')}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-[#22253a]',
                !sidebarOpen && 'justify-center'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn('p-3 border-t border-[#2a2d3a]', !sidebarOpen && 'flex justify-center')}>
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg bg-[#22253a]',
          !sidebarOpen && 'px-2'
        )}>
          <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
          {sidebarOpen && <span className="text-xs text-slate-400">Time Tracker</span>}
        </div>
      </div>
    </aside>
  );
}
