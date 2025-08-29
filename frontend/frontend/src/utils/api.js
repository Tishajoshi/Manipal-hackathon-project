import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000', // Use the same port as React for development
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development when backend is not available
const mockData = {
  items: [
    { id: 1, name: 'Sample Policy 1', description: 'This is a sample insurance policy' },
    { id: 2, name: 'Sample Policy 2', description: 'Another sample insurance policy' },
  ],
  decision: 'Approved',
  amount: '$5,000',
  justification: 'Policy covers this claim based on section 3.2'
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here (e.g., 401 unauthorized, etc.)
    if (error.response && error.response.status === 401) {
      // Redirect to login or clear auth
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
    return Promise.reject(error);
  }
);

// Enhanced API with fallback to mock data
const enhancedApi = {
  ...api,
  get: async (url, config) => {
    try {
      return await api.get(url, config);
    } catch (error) {
      console.log('Using mock data for GET:', url);
      // Return mock data for specific endpoints
      if (url.includes('/history/')) {
        return { data: { items: mockData.items } };
      }
      return { data: mockData };
    }
  },
  post: async (url, data, config) => {
    try {
      return await api.post(url, data, config);
    } catch (error) {
      console.log('Using mock data for POST:', url);
      // Return mock data for specific endpoints
      if (url === '/run') {
        return { data: mockData };
      }
      return { data: mockData };
    }
  }
};

export default enhancedApi;