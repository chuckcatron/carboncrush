'use client';

import { motion } from 'framer-motion';
import { 
  TrendingDown, 
  Target, 
  Award, 
  Users,
  Leaf,
  Zap,
  Car,
  Home,
  Utensils,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import CarbonChart from './CarbonChart';
import AIRecommendations from './AIRecommendations';

export default function Dashboard() {
  const stats = [
    {
      title: 'Monthly Carbon Footprint',
      value: '2.4 tons',
      change: '-12%',
      trend: 'down',
      icon: Leaf,
      color: 'emerald'
    },
    {
      title: 'Reduction Goal',
      value: '85%',
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Community Rank',
      value: '#47',
      change: '+12',
      trend: 'up',
      icon: Award,
      color: 'purple'
    },
    {
      title: 'Actions Completed',
      value: '23',
      change: '+8',
      trend: 'up',
      icon: Zap,
      color: 'orange'
    }
  ];

  const categories = [
    { name: 'Transportation', value: 45, icon: Car, color: 'red' },
    { name: 'Energy', value: 30, icon: Home, color: 'yellow' },
    { name: 'Food', value: 20, icon: Utensils, color: 'green' },
    { name: 'Other', value: 5, icon: Calendar, color: 'gray' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Welcome back, Alex! 🌱
            </h2>
            <p className="text-slate-600">
              You've reduced your carbon footprint by 12% this month. Keep crushing it!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center floating-animation">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          
          return (
            <motion.div
              key={stat.title}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carbon Footprint Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6">Carbon Footprint Trend</h3>
          <CarbonChart />
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6">Emissions by Category</h3>
          <div className="space-y-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={category.name} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${category.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{category.name}</span>
                      <span className="text-sm text-slate-600">{category.value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div
                        className={`bg-${category.color}-500 h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.value}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* AI Recommendations */}
      <AIRecommendations />
    </div>
  );
}