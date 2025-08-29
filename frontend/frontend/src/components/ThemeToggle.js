import React, { useEffect, useState } from 'react';

const THEME_KEY = 'app-theme'; // 'light' | 'dark' | 'system' | 'glass'

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  // dark class for Tailwind
  if (resolved === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  // glass flag as data-attr
  if (theme === 'glass') root.setAttribute('data-glass', 'true');
  else root.removeAttribute('data-glass');
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'system');

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => theme === 'system' && applyTheme('system');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [theme]);

  return (
    <div className={`relative ${className}`}>
      <select
        aria-label="Theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-gray-800 text-white dark:bg-gray-700 border border-white/10 rounded px-3 py-2 text-sm"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="glass">Glass</option>
      </select>
    </div>
  );
}

