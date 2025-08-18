import React from 'react';
import { UserProfile } from '@clerk/clerk-react';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-tr from-slate-900 via-indigo-900 to-indigo-700">
      <div className="p-6 rounded-2xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/20 shadow-xl">
        <UserProfile routing="path" path="/profile" />
      </div>
    </div>
  );
}

