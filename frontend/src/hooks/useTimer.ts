'use client';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export const useTimer = () => {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, tickTimer, setTimerTask } = useStore();

  useEffect(() => {
    if (!timer.isRunning) return;
    const id = setInterval(tickTimer, 1000);
    return () => clearInterval(id);
  }, [timer.isRunning, tickTimer]);

  return { timer, startTimer, pauseTimer, resumeTimer, stopTimer, setTimerTask };
};
