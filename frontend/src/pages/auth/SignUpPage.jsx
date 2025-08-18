import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <div className="p-6 rounded-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 shadow-xl">
        <SignUp routing="path" path="/signup" signInUrl="/login" afterSignUpUrl="/" />
      </div>
    </div>
  );
}

