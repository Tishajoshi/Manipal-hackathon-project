import React from 'react';
import ThemeToggle from '../components/ThemeToggle';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white p-6">
      <div className={`max-w-2xl mx-auto p-6 rounded-2xl ${document.documentElement.getAttribute('data-glass') ? 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20' : 'bg-gray-900/60'}`}>
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <div className="space-y-3">
          <div className="text-lg">Theme</div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

