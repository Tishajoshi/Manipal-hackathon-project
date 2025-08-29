// Utility functions for authentication

// Get token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Set token in localStorage
export function setToken(token) {
  localStorage.setItem("token", token);
}

// Remove token from localStorage (logout)
export function removeToken() {
  localStorage.removeItem("token");
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
