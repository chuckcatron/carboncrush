'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  location?: string;
  profilePicture?: string;
  carbonGoal?: number;
  joinDate: string;
  onboardingCompleted: boolean;
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    shareProgress: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  completeOnboarding: (data: Partial<User>) => void;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const storedUser = localStorage.getItem('carboncrush_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('carboncrush_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - check against stored users or use demo account
    const storedUsers = JSON.parse(localStorage.getItem('carboncrush_users') || '[]');
    const existingUser = storedUsers.find((u: any) => u.email === email);
    
    if (existingUser && existingUser.password === password) {
      const { password: _, ...userWithoutPassword } = existingUser;
      setUser(userWithoutPassword);
      localStorage.setItem('carboncrush_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return { success: true };
    }
    
    // Demo account for testing
    if (email === 'demo@carboncrush.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@carboncrush.com',
        name: 'Alex Green',
        location: 'San Francisco, CA',
        carbonGoal: 2000,
        joinDate: new Date().toISOString(),
        onboardingCompleted: true,
        preferences: {
          notifications: true,
          publicProfile: true,
          shareProgress: true
        }
      };
      setUser(demoUser);
      localStorage.setItem('carboncrush_user', JSON.stringify(demoUser));
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('carboncrush_users') || '[]');
    const existingUser = storedUsers.find((u: any) => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: 'User with this email already exists' };
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      joinDate: new Date().toISOString(),
      onboardingCompleted: false,
      preferences: {
        notifications: true,
        publicProfile: false,
        shareProgress: false
      }
    };
    
    // Store user with password for mock authentication
    const userWithPassword = { ...newUser, password };
    storedUsers.push(userWithPassword);
    localStorage.setItem('carboncrush_users', JSON.stringify(storedUsers));
    
    // Set current user (without password)
    setUser(newUser);
    localStorage.setItem('carboncrush_user', JSON.stringify(newUser));
    
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carboncrush_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('carboncrush_user', JSON.stringify(updatedUser));
    
    // Update in users array too
    const storedUsers = JSON.parse(localStorage.getItem('carboncrush_users') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      storedUsers[userIndex] = { ...storedUsers[userIndex], ...updates };
      localStorage.setItem('carboncrush_users', JSON.stringify(storedUsers));
    }
  };

  const completeOnboarding = (data: Partial<User>) => {
    updateProfile({ ...data, onboardingCompleted: true });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};