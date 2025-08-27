import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/authService';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <div className="p-6 rounded-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <div className="bg-red-500/20 p-3 rounded mb-4 text-white">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-white/10 border border-white/30 text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-white/10 border border-white/30 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-colors"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>Don't have an account? <a href="/signup" className="text-indigo-300 hover:text-indigo-200">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
}

