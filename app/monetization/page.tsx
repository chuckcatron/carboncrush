'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Handshake, 
  Leaf, 
  TrendingUp,
  DollarSign,
  Users,
  Award,
  BarChart3
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PremiumFeatures from '@/components/monetization/PremiumFeatures';
import CarbonOffsetMarketplace from '@/components/monetization/CarbonOffsetMarketplace';
import BusinessPartnerships from '@/components/monetization/BusinessPartnerships';
import BoltAttribution from '@/components/BoltAttribution';

export default function MonetizationPage() {
  const [activeTab, setActiveTab] = useState('premium');

  const tabs = [
    { id: 'premium', label: 'Premium Plans', icon: Crown },
    { id: 'offsets', label: 'Carbon Offsets', icon: Leaf },
    { id: 'partnerships', label: 'Partnerships', icon: Handshake },
    { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 }
  ];

  const revenueStreams = [
    {
      name: 'Premium Subscriptions',
      monthly: 45000,
      growth: 15,
      icon: Crown,
      color: 'purple'
    },
    {
      name: 'Carbon Offset Sales',
      monthly: 28000,
      growth: 22,
      icon: Leaf,
      color: 'green'
    },
    {
      name: 'Partner Commissions',
      monthly: 18500,
      growth: 8,
      icon: Handshake,
      color: 'blue'
    },
    {
      name: 'Business Solutions',
      monthly: 35000,
      growth: 31,
      icon: Award,
      color: 'orange'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'premium':
        return <PremiumFeatures />;
      case 'offsets':
        return <CarbonOffsetMarketplace />;
      case 'partnerships':
        return <BusinessPartnerships />;
      case 'analytics':
        return (
          <div className="space-y-8">
            {/* Revenue Overview */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Revenue Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {revenueStreams.map((stream, index) => {
                  const Icon = stream.icon;
                  return (
                    <motion.div
                      key={stream.name}
                      className="p-4 glass rounded-xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 bg-${stream.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${stream.color}-600`} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">{stream.name}</p>
                          <p className="text-lg font-bold text-slate-900">
                            ${stream.monthly.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">+{stream.growth}%</span>
                        <span className="text-slate-500">vs last month</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Total Revenue */}
            <motion.div
              className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                ${revenueStreams.reduce((sum, stream) => sum + stream.monthly, 0).toLocaleString()}
              </h3>
              <p className="text-slate-600">Total Monthly Revenue</p>
              <p className="text-emerald-600 font-medium mt-2">
                +19% growth this month
              </p>
            </motion.div>
          </div>
        );
      default:
        return <PremiumFeatures />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Bolt Attribution */}
        <BoltAttribution />

        {/* Header */}
        <header className="glass sticky top-0 z-40 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-slate-900">Monetization Hub</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 glass rounded-full px-4 py-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold">$126.5K MRR</span>
                </div>
              </div>
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
      </div>
    </ProtectedRoute>
  );
}