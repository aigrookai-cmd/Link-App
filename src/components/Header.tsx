import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Sun, Moon, TreePine, Palette, LogOut, User, ChevronDown,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

type Theme = 'light' | 'dark' | 'midnight' | 'forest';

const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun size={16} /> },
  { id: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  { id: 'midnight', label: 'Midnight', icon: <Palette size={16} /> },
  { id: 'forest', label: 'Forest', icon: <TreePine size={16} /> },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg">
            <Link2 size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-[var(--text-primary)] hidden sm:block">
            Link<span className="text-[var(--accent)]">Saver</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="relative">
            <button
              onClick={() => { setShowThemeMenu(!showThemeMenu); setShowUserMenu(false); }}
              className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all"
            >
              {theme === 'light' ? <Sun size={18} /> : theme === 'dark' ? <Moon size={18} /> : theme === 'midnight' ? <Palette size={18} /> : <TreePine size={18} />}
            </button>
            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); setShowThemeMenu(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          theme === t.id
                            ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {t.icon}
                        {t.label}
                        {theme === t.id && <Check size={14} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowThemeMenu(false); }}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-card)] transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-[var(--text-primary)] hidden sm:block max-w-[100px] truncate">
                {user?.name}
              </span>
              <ChevronDown size={14} className="text-[var(--text-muted)]" />
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-[var(--border)]">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{user?.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); showToast('Signed out successfully', 'info'); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showThemeMenu || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowThemeMenu(false); setShowUserMenu(false); }}
        />
      )}
    </header>
  );
}
