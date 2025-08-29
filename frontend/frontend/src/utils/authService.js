// Simple authentication service using localStorage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// User authentication functions
export const login = (email, password) => {
  // For demo purposes, accept any email/password
  // In a real app, you would validate against a backend
  const userData = {
    id: Math.random().toString(36).substring(2, 15),
    email,
    name: email.split('@')[0],
    isAuthenticated: true
  };
  
  // Store user data and a fake token
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  localStorage.setItem(AUTH_TOKEN_KEY, `demo-token-${Date.now()}`);
  
  return userData;
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const register = (email, password) => {
  // For demo purposes, just create a user
  return login(email, password);
};