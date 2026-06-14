import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'midnight' | 'forest';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeClasses: Record<Theme, string> = {
  light: 'theme-light',
  dark: 'theme-dark',
  midnight: 'theme-midnight',
  forest: 'theme-forest',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('linksaver_theme') as Theme;
    return stored || 'dark';
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('linksaver_theme', t);
  };

  useEffect(() => {
    document.documentElement.className = themeClasses[theme];
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
