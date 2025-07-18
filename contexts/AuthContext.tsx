"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { User } from "@/lib/schema";
import toast from "react-hot-toast";

// Check if we're in Bolt/StackBlitz environment
const isBolt = typeof window !== "undefined" && (window.location.hostname.includes("stackblitz") || window.location.hostname.includes("bolt") || (window.location.hostname === "localhost" && process.env.NODE_ENV === "development"));

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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [customSession, setCustomSession] = useState<any>(null);
  const [isCustomLoading, setIsCustomLoading] = useState(true);

  // Force Bolt environment for development
  const isBoltEnv = true;

  const isLoading = isBoltEnv ? isCustomLoading : status === "loading";

  // Custom session check for Bolt
  useEffect(() => {
    if (isBoltEnv) {
      checkCustomSession();
    }
  }, []);

  const checkCustomSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();

      if (data.user) {
        console.log("Custom session user:", data.user);
        setCustomSession({ user: data.user });

        // Fetch full user profile to get latest onboarding status
        await fetchUserProfile(data.user.id);
      }
    } catch (error) {
      console.error("Custom session check error:", error);
    } finally {
      setIsCustomLoading(false);
    }
  };

  useEffect(() => {
    if (!isBoltEnv && session?.user) {
      // Fetch full user profile for non-Bolt environments
      fetchUserProfile(session.user.id);
    } else if (!isBoltEnv) {
      setUser(null);
    }
  }, [session, isBoltEnv]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId);
      console.log("Fetching user profile for:", userId);

      let response;
      if (isBoltEnv) {
        // Use a dedicated endpoint for fetching profiles in Bolt
        response = await fetch("/api/get-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({ userId }),
        });
      } else {
        response = await fetch(`/api/user/${userId}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
      }

      if (response.ok) {
        const userData = await response.json();
        console.log("User profile fetched:", userData);
        console.log("Onboarding completed (camelCase):", userData.onboardingCompleted);
        console.log("Onboarding completed (snake_case):", userData.onboarding_completed);
        setUser(userData);

        // Update custom session if in Bolt environment
        if (isBoltEnv) {
          setCustomSession({ user: userData });
        }
      } else {
        console.error("Failed to fetch user profile:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Force Bolt environment for development
      const isBoltEnv = true;

      console.log("Login attempt - isBolt:", isBoltEnv);

      if (isBoltEnv) {
        // Use custom auth endpoint for Bolt
        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { success: false, error: data.error || "Sign in failed" };
        }

        // Manually update the session and fetch full profile
        if (data.user) {
          setUser(data.user);
          setCustomSession({ user: data.user });
          
          // Fetch full profile in background
          fetchUserProfile(data.user.id).catch(console.error);
          
          // Force redirect after a short delay to ensure state is updated
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/main';
            }
          }, 100);
        }

        return { success: true };
      }

      // Use NextAuth for non-Bolt environments
      console.log("Attempting login with NextAuth...");

      const result = (await Promise.race([
        signIn("credentials", {
          email: email.toLowerCase().trim(),
          password,
          redirect: false,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Login timeout")), 15000)),
      ])) as any;

      console.log("NextAuth result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);
        return { success: false, error: "Invalid credentials" };
      }

      if (result?.ok) {
        console.log("Login successful");
        return { success: true };
      }

      return { success: false, error: "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error && error.message === "Login timeout") {
        return { success: false, error: "Login request timed out. Please try again." };
      }
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const signup = async (email: string, password: string, name: string, metadata: any = {}): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = (await Promise.race([
        fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            password,
            name: name.trim(),
            metadata,
          }),
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Signup timeout")), 15000)),
      ])) as Response;

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error };
      }

      // Auto-login after successful signup
      const loginResult = await login(email, password);
      return loginResult;
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error && error.message === "Signup timeout") {
        return { success: false, error: "Signup request timed out. Please try again." };
      }
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut({ redirect: false });
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    let currentUser = user;
    
    // If user is not available but we have session data, try to get user from session
    if (!currentUser && (customSession?.user || session?.user)) {
      currentUser = customSession?.user || session?.user;
      console.log("Using session user for profile update:", currentUser);
    }
    
    if (!currentUser) {
      console.error("No user available for profile update");
      console.error("User state:", user);
      console.error("Session state:", isBoltEnv ? customSession : session);
      throw new Error("No user available for profile update");
    }
    
    if (!currentUser.id) {
      console.error("User has no ID:", currentUser);
      throw new Error("User ID is missing");
    }

    try {
      console.log("Updating profile for user:", currentUser.id, "with updates:", updates);
      console.log("Current isBoltEnv:", isBoltEnv);

      // Use different endpoint for Bolt environment to avoid middleware interference
      let response;

      if (isBoltEnv) {
        const requestBody = { userId: currentUser.id, ...updates };
        console.log("Sending request to /api/update-profile with body:", requestBody);
        console.log("JSON stringified body:", JSON.stringify(requestBody));
        
        response = await fetch("/api/update-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        response = await fetch(`/api/user/${currentUser.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });
      }

      console.log("Profile update response status:", response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Profile update failed - raw response:", responseText);

        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${responseText}` };
        }

        console.error("Profile update failed:", errorData);
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      console.log("Profile updated successfully:", updatedUser);
      console.log("Updated onboarding status (camelCase):", updatedUser.onboardingCompleted);
      console.log("Updated onboarding status (snake_case):", updatedUser.onboarding_completed);

      setUser(updatedUser);

      // Update session based on environment
      if (isBoltEnv) {
        setCustomSession({ user: updatedUser });
        
        // If we just completed onboarding, double-check by refetching the user
        if (updates.onboardingCompleted === true) {
          console.log('Onboarding was completed, waiting and refetching user profile...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          await fetchUserProfile(updatedUser.id);
        }
      } else {
        // Update the session if onboarding status changed
        if (updates.onboardingCompleted !== undefined) {
          await update({
            onboardingCompleted: updates.onboardingCompleted,
          });
        }
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    }
  };

  const completeOnboarding = async (data: Partial<User>): Promise<void> => {
    console.log("Completing onboarding with data:", data);
    console.log("Current user state:", user);
    console.log("Current session state:", isBoltEnv ? customSession : session);
    
    // If user is not available but we have session data, try to get user from session
    if (!user && (customSession?.user || session?.user)) {
      const sessionUser = customSession?.user || session?.user;
      console.log("No user state but session available, setting user from session:", sessionUser);
      setUser(sessionUser);
      
      // Wait a brief moment for state update
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const updateData = { ...data, onboardingCompleted: true };
    console.log('Data being passed to updateProfile:', updateData);
    console.log('onboardingCompleted value:', updateData.onboardingCompleted);
    await updateProfile(updateData);
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to send verification email" };
      }

      toast.success("Verification email sent!");
      return { success: true };
    } catch (error) {
      console.error("Error sending verification email:", error);
      return { success: false, error: "Failed to send verification email" };
    }
  };

  const value: AuthContextType = {
    user,
    session: isBoltEnv ? customSession : session,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    completeOnboarding,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
