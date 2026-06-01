import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch {
          // quota exceeded or other error
        }
        return valueToStore;
      });
    },
    [key]
  );

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export interface ReadingHistoryEntry {
  key: string;
  title: string;
  author: string;
  coverId?: number;
  ia?: string;
  openedAt: string; // ISO timestamp
  lastReadAt: string; // ISO timestamp
  progress: number; // 0-100
}

export interface BookmarkEntry {
  key: string;
  title: string;
  author: string;
  coverId?: number;
  ia?: string;
  addedAt: string; // ISO timestamp
}

export interface UserSettings {
  name: string;
  dob: string; // ISO date string
  age: number;
  sex: 'male' | 'female' | 'other' | '';
  theme: 'dark' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  onboardingComplete: boolean;
  bookmarks: BookmarkEntry[];
  readingHistory: ReadingHistoryEntry[];
  readingProgress: Record<string, number>; // key -> percentage
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  name: '',
  dob: '',
  age: 0,
  sex: '',
  theme: 'dark',
  onboardingComplete: false,
  bookmarks: [],
  readingHistory: [],
  readingProgress: {},
};

export const THEMES = [
  { id: 'dark' as const, label: 'Deep Void', primary: '#DEDBC8', bg: '#070709', accent: '#6366f1' },
  { id: 'indigo' as const, label: 'Cosmic Indigo', primary: '#e0e7ff', bg: '#0f0d1a', accent: '#818cf8' },
  { id: 'emerald' as const, label: 'Forest Whisper', primary: '#d1fae5', bg: '#0a140e', accent: '#34d399' },
  { id: 'amber' as const, label: 'Golden Hour', primary: '#fef3c7', bg: '#120f08', accent: '#f59e0b' },
  { id: 'rose' as const, label: 'Dusk Rose', primary: '#fce7f3', bg: '#140a0f', accent: '#f472b6' },
  { id: 'slate' as const, label: 'Stone', primary: '#e2e8f0', bg: '#0b0c0e', accent: '#94a3b8' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export function applyTheme(theme: ThemeId) {
  const t = THEMES.find((t) => t.id === theme) || THEMES[0];
  document.documentElement.style.setProperty('--theme-primary', t.primary);
  document.documentElement.style.setProperty('--theme-bg', t.bg);
  document.documentElement.style.setProperty('--theme-accent', t.accent);
  document.documentElement.style.setProperty('--theme-bg-light', `${t.bg}cc`);
}
