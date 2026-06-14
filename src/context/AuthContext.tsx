import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'linksaver_users';
const SESSION_KEY = 'linksaver_session';

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const users = getUsers();
        const found = users.find((u) => u.id === parsed.id);
        if (found) {
          setUser(found);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return { success: false, error: 'Email is required' };
    if (!password) return { success: false, error: 'Password is required' };

    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!found) return { success: false, error: 'No account found with this email' };

    if (found.password !== hashPassword(password)) {
      return { success: false, error: 'Incorrect password' };
    }

    setUser(found);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: found.id, email: found.email }));
    return { success: true };
  };

  const signup = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) return { success: false, error: 'Name is required' };
    if (trimmedName.length < 2) return { success: false, error: 'Name must be at least 2 characters' };
    if (!trimmedEmail) return { success: false, error: 'Email is required' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    if (!password) return { success: false, error: 'Password is required' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: trimmedName,
      email: trimmedEmail,
      password: hashPassword(password),
    };

    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: newUser.id, email: newUser.email }));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
