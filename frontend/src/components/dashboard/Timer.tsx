'use client';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { useCategories } from '@/hooks/useCategories';
import { formatSeconds, toLocalISOString } from '@/lib/utils';
import { logsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
  onLogCreated?: () => void;
}

export default function Timer({ onLogCreated }: Props) {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, setTimerTask } = useTimer();
  const { categories } = useCategories();
  const [taskName, setTaskName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [project, setProject] = useState('');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!timer.isRunning && !timer.isPaused) {
        if (taskName.trim()) handleStart();
      } else if (timer.isRunning) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    }
  }, [timer, taskName]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleStart = () => {
    if (!taskName.trim()) { toast.error('Enter a task name to start timer'); return; }
    startTimer(taskName, categoryId, project);
  };

  const handleStop = async () => {
    if (!timer.startedAt) return;
    const startTime = new Date(timer.startedAt);
    const endTime = new Date();
    try {
      await logsApi.create({
        taskName: timer.taskName || taskName,
        description: '',
        project: timer.project || project,
        startTime: toLocalISOString(startTime),
        endTime: toLocalISOString(endTime),
        tags: [],
        status: 'completed',
        priority: 'medium',
        categoryId: timer.categoryId || categoryId,
      });
      toast.success('Work session saved!');
      stopTimer();
      setTaskName('');
      setCategoryId('');
      setProject('');
      onLogCreated?.();
    } catch {
      toast.error('Failed to save session');
    }
  };

  const handleReset = () => {
    stopTimer();
    setTaskName('');
    setCategoryId('');
    setProject('');
  };

  const isActive = timer.isRunning || timer.isPaused;
  const displaySeconds = timer.elapsed;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-200">Live Timer</h2>
        <span className="text-xs text-slate-600">Space = start/pause</span>
      </div>

      <div className={`text-center mb-5 py-4 rounded-xl ${isActive ? 'bg-blue-600/5 border border-blue-500/20' : 'bg-[#0f1117]'}`}>
        <div className={`text-5xl font-mono font-bold tracking-widest mb-1 ${timer.isRunning ? 'text-blue-400' : timer.isPaused ? 'text-amber-400' : 'text-slate-600'}`}>
          {formatSeconds(displaySeconds)}
        </div>
        {isActive && (
          <p className="text-xs text-slate-500">
            {timer.isRunning ? '● Recording...' : '⏸ Paused'}
          </p>
        )}
      </div>

      {!isActive && (
        <div className="space-y-3 mb-4">
          <input
            className="input text-sm"
            placeholder="What are you working on?"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
          />
          <div className="grid grid-cols-2 gap-2">
            <select className="input text-sm" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
            <input className="input text-sm" placeholder="Project" value={project} onChange={e => setProject(e.target.value)} />
          </div>
        </div>
      )}

      {isActive && (
        <div className="mb-4 p-3 rounded-lg bg-[#0f1117] border border-[#2a2d3a]">
          <p className="text-sm font-medium text-slate-300 truncate">{timer.taskName}</p>
          {timer.project && <p className="text-xs text-slate-600 mt-0.5">{timer.project}</p>}
        </div>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <button onClick={handleStart} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <>
            <button
              onClick={timer.isRunning ? pauseTimer : resumeTimer}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {timer.isRunning ? 'Pause' : 'Resume'}
            </button>
            <button onClick={handleStop} className="btn-primary flex items-center justify-center gap-2 px-4">
              <Square className="w-4 h-4" />
              Stop
            </button>
            <button onClick={handleReset} className="btn-secondary px-3" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
