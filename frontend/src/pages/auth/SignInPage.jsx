import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <div className="p-6 rounded-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 shadow-xl">
        <SignIn routing="path" path="/login" signUpUrl="/signup" afterSignInUrl="/" />
      </div>
    </div>
  );
}

