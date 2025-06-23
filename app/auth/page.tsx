'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import BoltAttribution from '@/components/BoltAttribution';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'forgot'>('login');
  const { session, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && session) {
      // User is logged in, redirect to appropriate page
      if (user?.onboardingCompleted) {
        router.push('/main');
      } else {
        router.push('/onboarding');
      }
    }
  }, [session, user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Bolt Attribution */}
      <BoltAttribution />

      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">CarbonCrush</h1>
          <p className="text-slate-600 mt-2">Your climate action companion</p>
        </motion.div>

        {/* Auth Forms */}
        {currentView === 'login' && (
          <LoginForm
            onSwitchToSignup={() => setCurrentView('signup')}
            onForgotPassword={() => setCurrentView('forgot')}
          />
        )}
        
        {currentView === 'signup' && (
          <SignupForm
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
        
        {currentView === 'forgot' && (
          <ForgotPasswordForm
            onBackToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    </div>
  );
}