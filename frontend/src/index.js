import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

// Temporary hardcoded key to fix the issue
const publishableKey = "pk_test_c2FjcmVkLXNocmV3LTU5LmNsZXJrLmFjY291bnRzLmRldiQ";

// Validate the publishable key
if (!publishableKey) {
  console.error('❌ Clerk publishable key is missing!');
  throw new Error('Clerk publishable key is required');
}

console.log('✅ Clerk key loaded successfully:', publishableKey.substring(0, 20) + '...');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

// Performance monitoring removed for optimization
