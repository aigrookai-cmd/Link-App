import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
  createdAt: number;
}

interface DataContextType {
  categories: Category[];
  links: LinkItem[];
  addCategory: (cat: Omit<Category, 'id'>) => { success: boolean; error?: string };
  editCategory: (id: string, cat: Partial<Category>) => { success: boolean; error?: string };
  deleteCategory: (id: string) => void;
  addLink: (link: Omit<LinkItem, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  editLink: (id: string, link: Partial<LinkItem>) => { success: boolean; error?: string };
  deleteLink: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Development', icon: 'Code', color: '#3b82f6' },
  { id: '2', name: 'Design', icon: 'Palette', color: '#a855f7' },
  { id: '3', name: 'Social', icon: 'Globe', color: '#ec4899' },
  { id: '4', name: 'News', icon: 'Newspaper', color: '#f97316' },
];

const defaultLinks: LinkItem[] = [
  { id: '1', title: 'React Docs', url: 'https://react.dev', description: 'Official React documentation', categoryId: '1', createdAt: Date.now() - 86400000 },
  { id: '2', title: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'Utility-first CSS framework', categoryId: '1', createdAt: Date.now() - 172800000 },
  { id: '3', title: 'Dribbble', url: 'https://dribbble.com', description: 'Design inspiration', categoryId: '2', createdAt: Date.now() - 259200000 },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem('linksaver_categories');
      return stored ? JSON.parse(stored) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });
  const [links, setLinks] = useState<LinkItem[]>(() => {
    try {
      const stored = localStorage.getItem('linksaver_links');
      return stored ? JSON.parse(stored) : defaultLinks;
    } catch {
      return defaultLinks;
    }
  });

  useEffect(() => {
    localStorage.setItem('linksaver_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('linksaver_links', JSON.stringify(links));
  }, [links]);

  const addCategory = (cat: Omit<Category, 'id'>) => {
    if (!cat.name.trim()) return { success: false, error: 'Category name is required' };
    if (cat.name.trim().length > 50) return { success: false, error: 'Name must be under 50 characters' };
    if (categories.some((c) => c.name.toLowerCase() === cat.name.trim().toLowerCase())) {
      return { success: false, error: 'A category with this name already exists' };
    }
    setCategories((prev) => [...prev, { ...cat, id: generateId() }]);
    return { success: true };
  };

  const editCategory = (id: string, cat: Partial<Category>) => {
    if (cat.name !== undefined) {
      if (!cat.name.trim()) return { success: false, error: 'Category name is required' };
      if (cat.name.trim().length > 50) return { success: false, error: 'Name must be under 50 characters' };
      const exists = categories.some((c) => c.id !== id && c.name.toLowerCase() === cat.name!.trim().toLowerCase());
      if (exists) return { success: false, error: 'A category with this name already exists' };
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...cat } : c)));
    return { success: true };
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setLinks((prev) => prev.filter((l) => l.categoryId !== id));
  };

  const addLink = (link: Omit<LinkItem, 'id' | 'createdAt'>) => {
    if (!link.title.trim()) return { success: false, error: 'Title is required' };
    if (link.title.trim().length > 120) return { success: false, error: 'Title must be under 120 characters' };
    if (!link.url.trim()) return { success: false, error: 'URL is required' };
    try {
      new URL(link.url.trim());
    } catch {
      return { success: false, error: 'Please enter a valid URL' };
    }
    if (link.description.trim().length > 300) return { success: false, error: 'Description must be under 300 characters' };
    if (!categories.find((c) => c.id === link.categoryId)) {
      return { success: false, error: 'Selected category no longer exists' };
    }
    setLinks((prev) => [...prev, { ...link, id: generateId(), createdAt: Date.now() }]);
    return { success: true };
  };

  const editLink = (id: string, link: Partial<LinkItem>) => {
    if (link.title !== undefined) {
      if (!link.title.trim()) return { success: false, error: 'Title is required' };
      if (link.title.trim().length > 120) return { success: false, error: 'Title must be under 120 characters' };
    }
    if (link.url !== undefined) {
      if (!link.url.trim()) return { success: false, error: 'URL is required' };
      try {
        new URL(link.url.trim());
      } catch {
        return { success: false, error: 'Please enter a valid URL' };
      }
    }
    if (link.description !== undefined && link.description.trim().length > 300) {
      return { success: false, error: 'Description must be under 300 characters' };
    }
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...link } : l)));
    return { success: true };
  };

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <DataContext.Provider value={{ categories, links, addCategory, editCategory, deleteCategory, addLink, editLink, deleteLink }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
