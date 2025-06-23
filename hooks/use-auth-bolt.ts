import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
}

interface Session {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

export function useSession() {
  const [session, setSession] = useState<Session>({
    user: null,
    status: 'loading',
  });

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      setSession({
        user: data.user,
        status: data.user ? 'authenticated' : 'unauthenticated',
      });
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setSession({
        user: null,
        status: 'unauthenticated',
      });
    }
  };

  const update = () => {
    fetchSession();
  };

  return { data: session, status: session.status, update };
}

export async function signIn(credentials: { email: string; password: string }) {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Sign in failed');
    }

    // Reload the page to update session
    window.location.href = '/dashboard';
    return { ok: true, error: null };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function signOut() {
  try {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/auth';
  } catch (error) {
    console.error('Sign out error:', error);
  }
}