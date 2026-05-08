'use client';
import { create } from 'zustand';
import type { TimerState } from '@/lib/types';

interface AppStore {
  timer: TimerState;
  theme: 'dark' | 'light';
  sidebarOpen: boolean;

  setTheme: (theme: 'dark' | 'light') => void;
  toggleSidebar: () => void;

  startTimer: (taskName: string, categoryId: string, project: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
  setTimerTask: (taskName: string) => void;
}

const defaultTimer: TimerState = {
  isRunning: false,
  isPaused: false,
  startedAt: null,
  pausedAt: null,
  elapsed: 0,
  taskName: '',
  categoryId: '',
  project: '',
};

export const useStore = create<AppStore>((set, get) => ({
  timer: defaultTimer,
  theme: 'dark',
  sidebarOpen: true,

  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  startTimer: (taskName, categoryId, project) => {
    set({
      timer: {
        ...defaultTimer,
        isRunning: true,
        startedAt: Date.now(),
        elapsed: 0,
        taskName,
        categoryId,
        project,
      },
    });
  },

  pauseTimer: () => {
    const { timer } = get();
    if (!timer.isRunning) return;
    set({
      timer: {
        ...timer,
        isRunning: false,
        isPaused: true,
        pausedAt: Date.now(),
      },
    });
  },

  resumeTimer: () => {
    const { timer } = get();
    if (!timer.isPaused || !timer.pausedAt) return;
    const pauseDuration = Date.now() - timer.pausedAt;
    set({
      timer: {
        ...timer,
        isRunning: true,
        isPaused: false,
        pausedAt: null,
        startedAt: (timer.startedAt || 0) + pauseDuration,
      },
    });
  },

  stopTimer: () => set({ timer: defaultTimer }),

  tickTimer: () => {
    const { timer } = get();
    if (!timer.isRunning || !timer.startedAt) return;
    set({ timer: { ...timer, elapsed: Math.floor((Date.now() - timer.startedAt) / 1000) } });
  },

  setTimerTask: (taskName) => set(s => ({ timer: { ...s.timer, taskName } })),
}));
