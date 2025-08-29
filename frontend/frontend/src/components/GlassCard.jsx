import React from 'react';

export default function GlassCard({ className = '', children }) {
  const isGlass = document?.documentElement?.getAttribute('data-glass');
  const base = isGlass
    ? 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 shadow-lg'
    : 'bg-gray-900/60 shadow-lg';
  return <div className={`${base} ${className}`}>{children}</div>;
}

