import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Mail, Lock, User, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Too weak', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Strong', color: '#14b8a6' },
    { label: 'Very strong', color: '#3b82f6' },
  ];
  return { score, ...levels[score] };
}

export default function LoginSignup() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useAuth();

  const passStrength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    await new Promise((r) => setTimeout(r, 400));

    if (mode === 'login') {
      const result = login(email, password);
      if (!result.success) setError(result.error || 'Login failed');
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }
      const result = signup(name, email, password);
      if (!result.success) setError(result.error || 'Signup failed');
    }

    setIsSubmitting(false);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--accent)] mb-4 shadow-lg"
          >
            <Link2 size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">
            Link<span className="text-[var(--accent)]">Saver</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-base font-medium">
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        <div className="bg-[var(--bg-card)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border)]">
          <div className="flex gap-2 mb-6 p-1 bg-[var(--bg-secondary)] rounded-2xl">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-[var(--accent)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-[var(--accent)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {mode === 'signup' && password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(passStrength.score / 5) * 100}%` }}
                          className="h-full rounded-full transition-colors"
                          style={{ backgroundColor: passStrength.color }}
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: passStrength.color }}>
                        {passStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-[var(--text-muted)] font-medium">
                      <span className={password.length >= 6 ? 'text-emerald-400' : ''}>6+ chars</span>
                      <span className={/[A-Z]/.test(password) ? 'text-emerald-400' : ''}>Uppercase</span>
                      <span className={/[0-9]/.test(password) ? 'text-emerald-400' : ''}>Number</span>
                      <span className={/[^A-Za-z0-9]/.test(password) ? 'text-emerald-400' : ''}>Symbol</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm font-semibold text-center bg-red-500/5 rounded-xl py-2.5 px-3"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileTap={isSubmitting ? {} : { scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6 font-medium">
          Secure local storage. Your data stays on your device.
        </p>
      </motion.div>
    </div>
  );
}
