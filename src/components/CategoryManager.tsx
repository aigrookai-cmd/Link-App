import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Trash2, Pencil, Check, Folder,
} from 'lucide-react';
import { useData, type Category } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { availableIcons, getIcon } from '../utils/icons';

const colorPresets = [
  '#3b82f6', '#a855f7', '#ec4899', '#f97316', '#22c55e',
  '#06b6d4', '#ef4444', '#eab308', '#14b8a6', '#f43f5e',
  '#8b5cf6', '#0ea5e9', '#84cc16', '#d946ef', '#f59e0b',
];

interface CategoryFormProps {
  category?: Category;
  onSave: (data: { name: string; icon: string; color: string }) => void;
  onCancel: () => void;
}

function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const { categories } = useData();
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || 'Folder');
  const [color, setColor] = useState(category?.color || '#3b82f6');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.trim().length > 50) newErrors.name = 'Max 50 characters';
    else {
      const exists = categories.some(
        (c) => c.id !== category?.id && c.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (exists) newErrors.name = 'This name already exists';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ name: name.trim(), icon, color });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
          {category ? 'Edit Category' : 'New Category'}
        </h3>
        <button onClick={onCancel} className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: '' })); }}
            placeholder="Category name"
            maxLength={50}
            className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 font-medium transition-all ${
              errors.name ? 'border-red-400 focus:ring-red-400/30' : 'border-[var(--border)] focus:ring-[var(--accent)]'
            }`}
          />
          {errors.name && <p className="text-red-400 text-xs font-semibold mt-1.5">{errors.name}</p>}
          <p className="text-[10px] text-[var(--text-muted)] mt-1 text-right">{name.length}/50</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Icon</label>
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
              {(() => {
                const Icon = getIcon(icon);
                return <Icon size={16} className="text-white" />;
              })()}
            </div>
            <span className="font-medium">{icon}</span>
            <span className="ml-auto text-xs text-[var(--text-muted)] font-medium">{showIconPicker ? 'Hide' : 'Change'}</span>
          </button>
          <AnimatePresence>
            {showIconPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] max-h-48 overflow-y-auto grid grid-cols-6 gap-2">
                  {availableIcons.map((iconName) => {
                    const Icon = getIcon(iconName);
                    return (
                      <button
                        key={iconName}
                        onClick={() => { setIcon(iconName); setShowIconPicker(false); }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          icon === iconName
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--accent)]/20 hover:text-[var(--accent)]'
                        }`}
                        title={iconName}
                      >
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-xl transition-all ${color === c ? 'ring-2 ring-offset-2 ring-[var(--text-primary)] scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c, '--tw-ring-offset-color': 'var(--bg-card)' } as React.CSSProperties}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Check size={16} />
            {category ? 'Update' : 'Create'}
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-bold text-sm hover:bg-[var(--border)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CategoryManager() {
  const { categories, addCategory, editCategory, deleteCategory } = useData();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSave = (data: { name: string; icon: string; color: string }) => {
    if (editingId) {
      const result = editCategory(editingId, data);
      if (result.success) {
        showToast('Category updated successfully', 'success');
        setEditingId(null);
        setShowForm(false);
      } else {
        showToast(result.error || 'Failed to update category', 'error');
      }
    } else {
      const result = addCategory(data);
      if (result.success) {
        showToast('Category created successfully', 'success');
        setShowForm(false);
      } else {
        showToast(result.error || 'Failed to create category', 'error');
      }
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setDeleteConfirm(null);
    showToast('Category deleted', 'info');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-[var(--text-primary)]">Categories</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="w-10 h-10 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
          aria-label="Add category"
        >
          <Plus size={20} strokeWidth={2.5} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <CategoryForm
            category={editingId ? categories.find((c) => c.id === editingId) : undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingId(null); }}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {categories.map((cat) => {
            const Icon = getIcon(cat.icon);
            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--accent)]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.color + '20' }}
                  >
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--text-primary)] truncate">{cat.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium">{cat.icon}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cat.id)}
                      className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {deleteConfirm === cat.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-2">
                        <p className="text-xs text-red-400 font-semibold flex-1">Delete this category? All links in it will be removed.</p>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-bold hover:bg-[var(--border)] transition-colors"
                        >
                          No
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Folder size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-[var(--text-muted)] font-medium">No categories yet</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Create your first category to get started</p>
        </div>
      )}
    </div>
  );
}
