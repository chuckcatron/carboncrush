'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Zap,
  Car,
  Home,
  Utensils,
  Plane,
  ChevronRight,
  Star,
  Trophy,
  Globe,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CarbonCalculator from '@/components/CarbonCalculator';
import Dashboard from '@/components/Dashboard';
import CommunityHub from '@/components/CommunityHub';
import RewardsSystem from '@/components/RewardsSystem';
import BusinessDirectory from '@/components/BusinessDirectory';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import BoltAttribution from '@/components/BoltAttribution';

export default function MainApp() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('MainApp - user:', user);
  console.log('MainApp - onboardingCompleted:', user?.onboardingCompleted);

  // Show onboarding if user hasn't completed it
  // Check both camelCase and snake_case versions for compatibility
  const onboardingCompleted = user?.onboardingCompleted || (user as any)?.onboarding_completed;
  
  if (!onboardingCompleted) {
    console.log('Showing onboarding flow - onboardingCompleted:', onboardingCompleted);
    return <OnboardingFlow />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'calculator', label: 'Calculator', icon: Target },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'rewards', label: 'Rewards', icon: Award },
    { id: 'directory', label: 'Directory', icon: Globe },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <CarbonCalculator />;
      case 'community':
        return <CommunityHub />;
      case 'rewards':
        return <RewardsSystem />;
      case 'directory':
        return <BusinessDirectory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Bolt Attribution */}
        <BoltAttribution />

        {/* Email Verification Banner */}
        <EmailVerificationBanner />

        {/* Header */}
        <header className="glass sticky top-0 z-40 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center pulse-glow">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">CarbonCrush</h1>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold">1,247 pts</span>
                </div>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 glass rounded-full px-3 py-2 hover:bg-white/30 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden md:block">
                      {user?.name?.split(' ')[0]}
                    </span>
                    {!(user?.emailVerified || (user as any)?.email_verified) && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-white/30">
                    <div className="p-2">
                      <a
                        href="/profile"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </a>
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="glass border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto py-4">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderContent()}
          </motion.div>
        </main>

        {/* Floating Action Elements */}
        <div className="fixed bottom-6 right-6 space-y-4">
          <motion.button
            className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg flex items-center justify-center text-white floating-animation"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Zap className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </ProtectedRoute>
  );
}