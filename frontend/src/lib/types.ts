export type Status = 'in_progress' | 'completed' | 'on_hold';
export type Priority = 'high' | 'medium' | 'low';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  _count?: { workLogs: number };
  createdAt: string;
  updatedAt: string;
}

export interface WorkLog {
  id: string;
  taskName: string;
  description?: string | null;
  project?: string | null;
  startTime: string;
  endTime?: string | null;
  durationMinutes?: number | null;
  tags: string[];
  status: Status;
  priority: Priority;
  categoryId?: string | null;
  category?: Pick<Category, 'id' | 'name' | 'color' | 'icon'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLogFormData {
  taskName: string;
  description: string;
  project: string;
  startTime: string;
  endTime: string;
  tags: string[];
  status: Status;
  priority: Priority;
  categoryId: string;
}

export interface Stats {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  avgMinutesPerDay: number;
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
  mostActiveCategory: string;
}

export interface CategoryBreakdown {
  category: Pick<Category, 'id' | 'name' | 'color' | 'icon'>;
  totalMinutes: number;
  taskCount: number;
}

export interface Report {
  period: { start: string; end: string; type: string };
  summary: { totalMinutes: number; totalTasks: number };
  categoryBreakdown: CategoryBreakdown[];
  logs: WorkLog[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface LogsResponse {
  data: WorkLog[];
  pagination: Pagination;
}

export interface LogFilters {
  search: string;
  category: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startedAt: number | null;
  pausedAt: number | null;
  elapsed: number;
  taskName: string;
  categoryId: string;
  project: string;
}
