'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase';
import { Database } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface User extends Profile {
  // Add any additional user properties here
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setUser(profile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const createUserProfile = async (user: SupabaseUser, additionalData: any = {}) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email!,
        name: additionalData.name || user.user_metadata?.name || '',
        location: additionalData.location || null,
        carbon_goal: additionalData.carbonGoal || 2000,
        onboarding_completed: false,
        email_verified: user.email_confirmed_at ? true : false,
        subscribe_newsletter: additionalData.subscribeNewsletter || false,
        signup_source: additionalData.signupSource || 'web',
        avatar_url: user.user_metadata?.avatar_url || null,
        preferences: {
          notifications: true,
          public_profile: false,
          share_progress: false
        }
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    metadata: any = {}
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            ...metadata
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile
        await createUserProfile(data.user, { name, ...metadata });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Error signing out');
      }
    } catch (error) {
      console.error('Error in logout:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return;
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast.error('Failed to update profile');
    }
  };

  const completeOnboarding = async (data: Partial<User>): Promise<void> => {
    await updateProfile({ ...data, onboarding_completed: true });
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    if (!session?.user?.email) {
      return { success: false, error: 'No user email found' };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: session.user.email
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to resend verification email' };
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