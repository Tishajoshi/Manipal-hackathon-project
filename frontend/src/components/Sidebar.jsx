import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { logout, isAuthenticated } from '../utils/authService';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        location.pathname === to
          ? 'bg-indigo-600 text-white'
          : 'text-gray-200 hover:bg-indigo-600 hover:text-white'
      }`}
      onClick={() => setOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <aside className="text-white">
      <div className="md:hidden p-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-3 py-2 rounded-md bg-gray-800 border border-white/10"
        >
          Menu
        </button>
      </div>
      <div
        className={`fixed md:static inset-y-0 left-0 w-72 p-4 space-y-4 bg-gray-900/70 dark:bg-gray-900/60 backdrop-blur-lg border-r border-white/10 transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${document.documentElement.getAttribute('data-glass') ? 'bg-white/30 dark:bg-gray-900/30' : ''}`}
      >
        <div className="flex items-center justify-start text-xl font-bold">Insura</div>
        <nav className="space-y-2">
          <NavLink to="/dashboard">Dashboard</NavLink>
          {/* Profile link removed per request; icon in navbar opens profile */}
          <NavLink to="/settings">Settings</NavLink>
        </nav>
        <ThemeToggle />
        {authenticated ? (
          <button 
            onClick={handleSignOut}
            className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700"
          >
            Sign out
          </button>
        ) : (
          <div className="text-sm text-gray-300">Sign in to access dashboard</div>
        )}
      </div>
    </aside>
  );
}

