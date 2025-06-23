'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { User } from '@/lib/schema';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, metadata?: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  completeOnboarding: (data: Partial<User>) => Promise<void>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const isLoading = status === 'loading';

  useEffect(() => {
    if (session?.user) {
      // Fetch full user profile
      fetchUserProfile(session.user.id);
    } else {
      setUser(null);
    }
  }, [session]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting login with NextAuth...');
      
      // Add timeout for Bolt environment
      const result = await Promise.race([
        signIn('credentials', {
          email: email.toLowerCase().trim(),
          password,
          redirect: false,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout')), 15000)
        )
      ]) as any;

      console.log('NextAuth result:', result);

      if (result?.error) {
        console.error('Login error:', result.error);
        return { success: false, error: 'Invalid credentials' };
      }

      if (result?.ok) {
        console.log('Login successful');
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error && error.message === 'Login timeout') {
        return { success: false, error: 'Login request timed out. Please try again.' };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    metadata: any = {}
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await Promise.race([
        fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            password,
            name: name.trim(),
            metadata,
          }),
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Signup timeout')), 15000)
        )
      ]) as Response;

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error };
      }

      // Auto-login after successful signup
      const loginResult = await login(email, password);
      return loginResult;

    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error && error.message === 'Signup timeout') {
        return { success: false, error: 'Signup request timed out. Please try again.' };
      }
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut({ redirect: false });
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      // Update the session if onboarding status changed
      if (updates.onboardingCompleted !== undefined) {
        await update({
          onboardingCompleted: updates.onboardingCompleted
        });
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const completeOnboarding = async (data: Partial<User>): Promise<void> => {
    await updateProfile({ ...data, onboardingCompleted: true });
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to send verification email' };
      }

      toast.success('Verification email sent!');
      return { success: true };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error: 'Failed to send verification email' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    completeOnboarding,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};