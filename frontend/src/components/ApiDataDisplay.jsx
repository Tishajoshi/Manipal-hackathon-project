import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ApiDataDisplay = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call a guaranteed route in the running backend (query_api.py)
    api.get('/ping')
      .then((res) => {
        setMessage(res.data?.message || 'ok');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error pinging backend:', err);
        setError('Failed to reach backend.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white p-4">Checking backend…</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mt-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-2">Backend API Connection</h2>
      <p className="text-gray-300">/ping → <span className="text-indigo-300 font-semibold">{message}</span></p>
    </div>
  );
};

export default ApiDataDisplay;