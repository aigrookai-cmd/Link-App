import { motion } from 'framer-motion';
import { Link2, Folder, BarChart3 } from 'lucide-react';

type Tab = 'links' | 'categories' | 'stats';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'links', label: 'Links', icon: <Link2 size={20} /> },
  { id: 'categories', label: 'Categories', icon: <Folder size={20} /> },
  { id: 'stats', label: 'Stats', icon: <BarChart3 size={20} /> },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-t border-[var(--border)] safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute inset-0 bg-[var(--accent)]/10 rounded-xl"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className={`relative z-10 transition-colors ${activeTab === tab.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
              {tab.icon}
            </span>
            <span className={`relative z-10 text-[10px] font-bold transition-colors ${activeTab === tab.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
