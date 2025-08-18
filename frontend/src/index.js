import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
