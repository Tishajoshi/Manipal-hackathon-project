import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../utils/authService';
import { useNavigate } from 'react-router-dom';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = getCurrentUser();
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-tr from-slate-900 via-indigo-900 to-indigo-700">
      <div className="p-6 rounded-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">User Profile</h2>
        <div className="bg-white/10 p-4 rounded-lg mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white">Email</label>
            <div className="p-2 bg-white/5 rounded border border-white/20 text-white">{user.email}</div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-white">Name</label>
            <div className="p-2 bg-white/5 rounded border border-white/20 text-white">{user.name}</div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

