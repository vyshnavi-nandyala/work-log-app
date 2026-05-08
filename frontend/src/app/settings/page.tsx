'use client';
import { useState } from 'react';
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useStore } from '@/store/useStore';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/lib/types';
import toast from 'react-hot-toast';

const PRESET_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#64748b', '#6366f1', '#84cc16'];
const PRESET_ICONS = ['📁', '🗄️', '🤖', '📚', '📅', '📝', '🔍', '🐛', '⚙️', '💡', '🚀', '🎯', '🔧', '📊', '💼'];

interface CategoryFormData { name: string; color: string; icon: string }

function CategoryForm({ initial, onSave, onCancel }: {
  initial?: CategoryFormData;
  onSave: (data: CategoryFormData) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<CategoryFormData>(initial || { name: '', color: '#3b82f6', icon: '📁' });

  const set = (k: keyof CategoryFormData, v: string) => setData(d => ({ ...d, [k]: v }));

  return (
    <div className="card p-4 border-blue-500/20">
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="label">Category Name</label>
            <input className="input text-sm" placeholder="e.g. Data Engineering" value={data.name} onChange={e => set('name', e.target.value)} autoFocus />
          </div>
        </div>
        <div>
          <label className="label">Icon</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => set('icon', icon)}
                className={`w-9 h-9 rounded-lg text-lg hover:bg-[#22253a] border transition-colors ${data.icon === icon ? 'border-blue-500/50 bg-blue-500/10' : 'border-[#2a2d3a]'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Color</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                onClick={() => set('color', color)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${data.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input type="color" className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent" value={data.color} onChange={e => set('color', e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border" style={{ borderColor: `${data.color}40`, backgroundColor: `${data.color}20`, color: data.color }}>
            <span>{data.icon}</span>
            <span>{data.name || 'Preview'}</span>
          </div>
          <div className="flex gap-2 ml-auto">
            <button onClick={onCancel} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1"><X className="w-3 h-3" />Cancel</button>
            <button onClick={() => data.name.trim() && onSave(data)} className="btn-primary text-sm px-3 py-1.5 flex items-center gap-1"><Check className="w-3 h-3" />Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({ cat, onEdit, onDelete }: { cat: Category; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0f1117] border border-[#2a2d3a] hover:border-slate-600 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${cat.color}20` }}>{cat.icon}</div>
        <div>
          <p className="text-sm font-medium text-slate-200">{cat.name}</p>
          {cat._count !== undefined && <p className="text-xs text-slate-600">{cat._count.workLogs} log{cat._count.workLogs !== 1 ? 's' : ''}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
        <button onClick={onEdit} className="p-1.5 hover:bg-blue-500/10 hover:text-blue-400 text-slate-600 rounded-md transition-colors"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-600 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { sidebarOpen, theme, setTheme } = useStore();
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const handleCreate = async (data: CategoryFormData) => {
    await createCategory(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: CategoryFormData) => {
    if (!editingCat) return;
    await updateCategory(editingCat.id, data);
    setEditingCat(null);
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"? This won't delete its work logs.`)) return;
    await deleteCategory(cat.id);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'} p-6`}>
        <Header title="Settings" subtitle="Manage categories and preferences" />

        <div className="max-w-2xl space-y-6">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-200 mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Theme</p>
                <p className="text-xs text-slate-600 mt-0.5">Choose your preferred color scheme</p>
              </div>
              <div className="flex gap-2">
                {(['dark', 'light'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); toast.success(`${t === 'dark' ? 'Dark' : 'Light'} theme applied`); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${theme === t ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-[#2a2d3a] text-slate-500 hover:text-slate-300'}`}
                  >
                    {t === 'dark' ? '🌙' : '☀️'} {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-200">Categories</h2>
              <button onClick={() => { setShowForm(true); setEditingCat(null); }} className="btn-primary flex items-center gap-1 text-sm py-1.5 px-3">
                <Plus className="w-4 h-4" />New
              </button>
            </div>

            <div className="space-y-2">
              {showForm && !editingCat && (
                <CategoryForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
              )}
              {categories.map(cat => (
                <div key={cat.id}>
                  {editingCat?.id === cat.id ? (
                    <CategoryForm
                      initial={{ name: cat.name, color: cat.color, icon: cat.icon }}
                      onSave={handleUpdate}
                      onCancel={() => setEditingCat(null)}
                    />
                  ) : (
                    <CategoryRow cat={cat} onEdit={() => setEditingCat(cat)} onDelete={() => handleDelete(cat)} />
                  )}
                </div>
              ))}
              {categories.length === 0 && !showForm && (
                <p className="text-slate-600 text-sm text-center py-6">No categories yet. Create one to organize your logs.</p>
              )}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-200 mb-4">Keyboard Shortcuts</h2>
            <div className="space-y-2">
              {[
                ['Space', 'Start / Pause timer (when not in a text field)'],
                ['Esc', 'Close modal'],
                ['Enter', 'Submit form / Add tag'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-[#2a2d3a] last:border-0">
                  <span className="text-sm text-slate-400">{desc}</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#0f1117] border border-[#2a2d3a] text-xs font-mono text-slate-400">{key}</kbd>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-slate-200 mb-1">About</h2>
            <p className="text-sm text-slate-500">Work Log v1.0.0 — Professional time tracking for data engineers and developers.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
