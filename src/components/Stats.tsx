import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link2, Folder, Clock, TrendingUp, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getIcon } from '../utils/icons';

export default function Stats() {
  const { categories, links } = useData();

  const stats = useMemo(() => {
    const totalLinks = links.length;
    const totalCategories = categories.length;
    const linksByCategory = categories.map((cat) => ({
      ...cat,
      count: links.filter((l) => l.categoryId === cat.id).length,
    })).sort((a, b) => b.count - a.count);

    const recentLinks = [...links]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    const oldestLink = links.length > 0
      ? new Date(Math.min(...links.map((l) => l.createdAt)))
      : null;

    return { totalLinks, totalCategories, linksByCategory, recentLinks, oldestLink };
  }, [categories, links]);

  const statCards = [
    { label: 'Total Links', value: stats.totalLinks, icon: <Link2 size={22} />, color: '#3b82f6' },
    { label: 'Categories', value: stats.totalCategories, icon: <Folder size={22} />, color: '#a855f7' },
    { label: 'This Week', value: links.filter((l) => l.createdAt > Date.now() - 7 * 86400000).length, icon: <Calendar size={22} />, color: '#22c55e' },
    { label: 'Today', value: links.filter((l) => l.createdAt > Date.now() - 86400000).length, icon: <Clock size={22} />, color: '#f97316' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-[var(--text-primary)]">Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: card.color + '20' }}
            >
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <p className="text-2xl font-black text-[var(--text-primary)]">{card.value}</p>
            <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Links by Category */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[var(--accent)]" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">Links by Category</h3>
          </div>
          {stats.linksByCategory.length > 0 ? (
            <div className="space-y-3">
              {stats.linksByCategory.map((cat) => {
                const Icon = getIcon(cat.icon);
                const maxCount = Math.max(...stats.linksByCategory.map((c) => c.count), 1);
                const pct = (cat.count / maxCount) * 100;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: cat.color + '20' }}
                      >
                        <Icon size={14} style={{ color: cat.color }} />
                      </div>
                      <span className="text-sm font-bold text-[var(--text-primary)] flex-1">{cat.name}</span>
                      <span className="text-sm font-black text-[var(--text-muted)]">{cat.count}</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden ml-9">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No data yet</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-[var(--accent)]" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">Recently Added</h3>
          </div>
          {stats.recentLinks.length > 0 ? (
            <div className="space-y-3">
              {stats.recentLinks.map((link) => {
                const cat = categories.find((c) => c.id === link.categoryId);
                const Icon = cat ? getIcon(cat.icon) : null;
                const date = new Date(link.createdAt);
                const timeAgo = getTimeAgo(date);
                return (
                  <div key={link.id} className="flex items-center gap-3">
                    {cat && Icon && (
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cat.color + '20' }}
                      >
                        <Icon size={16} style={{ color: cat.color }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">{link.title}</p>
                      <p className="text-xs text-[var(--text-muted)] font-medium">{timeAgo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
