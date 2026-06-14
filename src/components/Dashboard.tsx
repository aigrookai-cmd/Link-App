import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link2, Folder, BarChart3 } from 'lucide-react';
import Header from './Header';
import BottomNav from './BottomNav';
import LinkManager from './LinkManager';
import CategoryManager from './CategoryManager';
import Stats from './Stats';

type Tab = 'links' | 'categories' | 'stats';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'links', label: 'Links', icon: <Link2 size={18} /> },
  { id: 'categories', label: 'Categories', icon: <Folder size={18} /> },
  { id: 'stats', label: 'Dashboard', icon: <BarChart3 size={18} /> },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('links');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <Header />

      {/* Desktop Tabs */}
      <div className="hidden sm:block sticky top-16 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="desktopTabIndicator"
                    className="absolute inset-0 bg-[var(--accent)]/10 rounded-xl border border-[var(--accent)]/20"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 pb-28 sm:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'links' && <LinkManager />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'stats' && <Stats />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
