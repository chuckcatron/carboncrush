'use client';

import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestAuth() {
  const { data: session, status } = useSession();
  const { user, isLoading } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">NextAuth Session:</h2>
          <pre className="text-sm">{JSON.stringify({ session, status }, null, 2)}</pre>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Auth Context:</h2>
          <pre className="text-sm">{JSON.stringify({ user, isLoading }, null, 2)}</pre>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Environment:</h2>
          <pre className="text-sm">{JSON.stringify({
            nodeEnv: process.env.NODE_ENV,
            nextAuthUrl: process.env.NEXTAUTH_URL,
            hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
          }, null, 2)}</pre>
        </div>
      </div>
      
      <div className="mt-4 space-x-4">
        <a href="/auth" className="text-blue-500 underline">Go to Auth Page</a>
        <a href="/main" className="text-blue-500 underline">Go to Main Page</a>
      </div>
    </div>
  );
}