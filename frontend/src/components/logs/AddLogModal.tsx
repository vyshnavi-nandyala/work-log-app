'use client';
import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCategories } from '@/hooks/useCategories';
import { logsApi } from '@/lib/api';
import { toLocalISOString } from '@/lib/utils';
import type { Category, WorkLogFormData } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_FORM: WorkLogFormData = {
  taskName: '',
  description: '',
  project: '',
  startTime: toLocalISOString(new Date()),
  endTime: '',
  tags: [],
  status: 'completed',
  priority: 'medium',
  categoryId: '',
};

export default function AddLogModal({ isOpen, onClose, onSuccess }: Props) {
  const { categories } = useCategories();
  const [form, setForm] = useState<WorkLogFormData>(DEFAULT_FORM);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(DEFAULT_FORM);
      setTagInput('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const canSubmit = useMemo(() => form.taskName.trim().length > 0 && form.startTime.trim().length > 0, [form]);

  const updateField = (field: keyof WorkLogFormData, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) return;
    setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Please provide a task name and start time.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || null,
        endTime: form.endTime || null,
      } as unknown as WorkLogFormData;

      await logsApi.create(payload);
      toast.success('Work log created');
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save work log';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-[#2a2d3a] bg-[#11151f] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#2a2d3a] p-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Add Work Log</h2>
            <p className="text-sm text-slate-500">Capture a new task, duration, and category.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Task</label>
              <input
                className="input"
                placeholder="Task name"
                value={form.taskName}
                onChange={e => updateField('taskName', e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="label">Project</label>
              <input
                className="input"
                placeholder="Project name"
                value={form.project}
                onChange={e => updateField('project', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[100px] resize-none"
              placeholder="Optional description"
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.categoryId}
                onChange={e => updateField('categoryId', e.target.value)}
              >
                <option value="">No category</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>{`${category.icon} ${category.name}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={e => updateField('status', e.target.value)}
              >
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Priority</label>
              <select
                className="input"
                value={form.priority}
                onChange={e => updateField('priority', e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="label">Start time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.startTime}
                onChange={e => updateField('startTime', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="label">End time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.endTime}
                onChange={e => updateField('endTime', e.target.value)}
              />
              <p className="text-xs text-slate-500">Leave blank for ongoing work.</p>
            </div>
            <div>
              <label className="label">Tags</label>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button type="button" onClick={addTag} className="btn-secondary whitespace-nowrap">Add</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <button key={tag} type="button" onClick={() => removeTag(tag)} className="rounded-full border border-slate-600 bg-slate-900 px-3 py-1 text-xs text-slate-200 transition hover:bg-slate-800">
                    {tag} <span className="ml-1 text-slate-400">×</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2a2d3a]">
            <button onClick={onClose} className="btn-secondary px-4 py-2">Cancel</button>
            <button onClick={handleSubmit} className="btn-primary px-4 py-2" disabled={!canSubmit || loading}>
              {loading ? 'Saving...' : 'Save Work Log'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
