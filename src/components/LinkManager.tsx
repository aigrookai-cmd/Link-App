import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Trash2, Pencil, Check, Link2, ExternalLink, Search,
  Filter, ChevronDown, Copy, CheckCheck,
} from 'lucide-react';
import { useData, type LinkItem, type Category } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { getIcon } from '../utils/icons';

interface LinkFormProps {
  link?: LinkItem;
  onSave: (data: { title: string; url: string; description: string; categoryId: string }) => void;
  onCancel: () => void;
}

function LinkForm({ link, onSave, onCancel }: LinkFormProps) {
  const { categories } = useData();
  const [title, setTitle] = useState(link?.title || '');
  const [url, setUrl] = useState(link?.url || '');
  const [description, setDescription] = useState(link?.description || '');
  const [categoryId, setCategoryId] = useState(link?.categoryId || (categories[0]?.id || ''));
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    else if (title.trim().length > 120) newErrors.title = 'Max 120 characters';

    if (!url.trim()) newErrors.url = 'URL is required';
    else {
      try {
        new URL(url.trim().startsWith('http') ? url.trim() : 'https://' + url.trim());
      } catch {
        newErrors.url = 'Invalid URL';
      }
    }

    if (description.trim().length > 300) newErrors.description = 'Max 300 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    onSave({ title: title.trim(), url: finalUrl, description: description.trim(), categoryId });
  };

  const selectedCat = categories.find((c) => c.id === categoryId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
          {link ? 'Edit Link' : 'New Link'}
        </h3>
        <button onClick={onCancel} className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: '' })); }}
            placeholder="e.g. React Documentation"
            maxLength={120}
            className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 font-medium transition-all ${
              errors.title ? 'border-red-400 focus:ring-red-400/30' : 'border-[var(--border)] focus:ring-[var(--accent)]'
            }`}
          />
          {errors.title && <p className="text-red-400 text-xs font-semibold mt-1.5">{errors.title}</p>}
          <p className="text-[10px] text-[var(--text-muted)] mt-1 text-right">{title.length}/120</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">URL *</label>
          <div className="relative">
            <Link2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (errors.url) setErrors((p) => ({ ...p, url: '' })); }}
              placeholder="https://example.com"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 font-medium transition-all ${
                errors.url ? 'border-red-400 focus:ring-red-400/30' : 'border-[var(--border)] focus:ring-[var(--accent)]'
              }`}
            />
          </div>
          {errors.url && <p className="text-red-400 text-xs font-semibold mt-1.5">{errors.url}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors((p) => ({ ...p, description: '' })); }}
            placeholder="Brief description..."
            rows={2}
            maxLength={300}
            className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 font-medium resize-none transition-all ${
              errors.description ? 'border-red-400 focus:ring-red-400/30' : 'border-[var(--border)] focus:ring-[var(--accent)]'
            }`}
          />
          {errors.description && <p className="text-red-400 text-xs font-semibold mt-1.5">{errors.description}</p>}
          <p className="text-[10px] text-[var(--text-muted)] mt-1 text-right">{description.length}/300</p>
        </div>

        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Category *</label>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            {selectedCat && (() => {
              const Icon = getIcon(selectedCat.icon);
              return (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: selectedCat.color + '20' }}>
                  <Icon size={14} style={{ color: selectedCat.color }} />
                </div>
              );
            })()}
            <span className="font-medium">{selectedCat?.name || 'Select category'}</span>
            <ChevronDown size={16} className="ml-auto text-[var(--text-muted)]" />
          </button>
          <AnimatePresence>
            {showCategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute z-20 left-0 right-0 top-full mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
              >
                {categories.map((cat) => {
                  const Icon = getIcon(cat.icon);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setCategoryId(cat.id); setShowCategoryDropdown(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                        categoryId === cat.id
                          ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                        <Icon size={12} style={{ color: cat.color }} />
                      </div>
                      {cat.name}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Check size={16} />
            {link ? 'Update' : 'Create'}
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

export default function LinkManager() {
  const { categories, links, addLink, editLink, deleteLink } = useData();
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLinks = useMemo(() => {
    let result = [...links];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        l.title.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') {
      result = result.filter((l) => l.categoryId === filterCategory);
    }
    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [links, search, filterCategory]);

  const handleSave = (data: { title: string; url: string; description: string; categoryId: string }) => {
    if (editingId) {
      const result = editLink(editingId, data);
      if (result.success) {
        showToast('Link updated successfully', 'success');
        setEditingId(null);
        setShowForm(false);
      } else {
        showToast(result.error || 'Failed to update link', 'error');
      }
    } else {
      const result = addLink(data);
      if (result.success) {
        showToast('Link saved successfully', 'success');
        setShowForm(false);
      } else {
        showToast(result.error || 'Failed to save link', 'error');
      }
    }
  };

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      showToast('URL copied to clipboard', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Failed to copy URL', 'error');
    }
  };

  const handleDelete = (id: string) => {
    deleteLink(id);
    setDeleteConfirm(null);
    showToast('Link deleted', 'info');
  };

  const getCategory = (catId: string): Category | undefined =>
    categories.find((c) => c.id === catId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-[var(--text-primary)]">My Links</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="w-10 h-10 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
          aria-label="Add link"
        >
          <Plus size={20} strokeWidth={2.5} />
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm font-medium"
          />
        </div>
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="appearance-none w-full sm:w-44 pl-9 pr-8 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <LinkForm
            link={editingId ? links.find((l) => l.id === editingId) : undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingId(null); }}
          />
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence>
          {filteredLinks.map((link) => {
            const cat = getCategory(link.categoryId);
            const Icon = cat ? getIcon(cat.icon) : null;
            return (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--accent)]/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  {cat && Icon && (
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: cat.color + '20' }}
                    >
                      <Icon size={20} style={{ color: cat.color }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[var(--text-primary)] truncate">{link.title}</h3>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--accent)] font-medium hover:underline truncate block mt-0.5"
                        >
                          {link.url}
                        </a>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleCopy(link.url, link.id)}
                          className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                          title="Copy URL"
                        >
                          {copiedId === link.id ? <CheckCheck size={14} /> : <Copy size={14} />}
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                          title="Open"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => { setEditingId(link.id); setShowForm(true); }}
                          className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(link.id)}
                          className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {link.description && (
                      <p className="text-sm text-[var(--text-secondary)] mt-1.5 line-clamp-2">{link.description}</p>
                    )}
                    {cat && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs font-semibold text-[var(--text-muted)]">{cat.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {deleteConfirm === link.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-2">
                        <p className="text-xs text-red-400 font-semibold flex-1">Delete this link?</p>
                        <button
                          onClick={() => handleDelete(link.id)}
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

      {filteredLinks.length === 0 && (
        <div className="text-center py-12">
          <Link2 size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-[var(--text-muted)] font-medium">
            {links.length === 0 ? 'No links saved yet' : 'No links match your search'}
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {links.length === 0 ? 'Add your first link to get started' : 'Try a different search term'}
          </p>
        </div>
      )}
    </div>
  );
}
