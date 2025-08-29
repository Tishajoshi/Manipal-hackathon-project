import React, { useState, useEffect } from 'react';

// Mock data for when the API is unavailable
const mockItems = [
  { id: 1, name: 'Sample Policy 1', description: 'This is a sample insurance policy' },
  { id: 2, name: 'Sample Policy 2', description: 'Another sample insurance policy' },
  { id: 3, name: 'Sample Policy 3', description: 'A third sample insurance policy with extended coverage' },
];

const ApiDataDisplay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from our backend API with fallback to mock data
    fetch('http://localhost:8000/api/data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data.items);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        console.log('Using mock data for ApiDataDisplay');
        // Use mock data instead of showing error
        setData(mockItems);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white p-4">Loading data from API...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mt-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Data from Backend API</h2>
      <div className="space-y-4">
        {data.map(item => (
          <div key={item.id} className="bg-gray-800/60 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-300">{item.name}</h3>
            <p className="text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDataDisplay;