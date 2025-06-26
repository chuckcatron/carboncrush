'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RecommendationStats {
  totalRecommendations: number;
  completedRecommendations: number;
  inProgressRecommendations: number;
  totalCO2Saved: number;
  totalCostSavings: number;
  completionRate: number;
  averageTimeToComplete: number;
}

export default function RecommendationTracker() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RecommendationStats>({
    totalRecommendations: 0,
    completedRecommendations: 0,
    inProgressRecommendations: 0,
    totalCO2Saved: 0,
    totalCostSavings: 0,
    completionRate: 0,
    averageTimeToComplete: 0
  });

  useEffect(() => {
    if (user?.id) {
      calculateStats();
    }
  }, [user?.id]);

  const calculateStats = useCallback(() => {
    const recommendations = JSON.parse(localStorage.getItem(`recommendations_${user?.id}`) || '[]');
    
    if (recommendations.length === 0) {
      return;
    }

    const completed = recommendations.filter((r: any) => r.status === 'completed');
    const inProgress = recommendations.filter((r: any) => r.status === 'in-progress');
    
    const totalCO2Saved = completed.reduce((sum: number, r: any) => {
      return sum + parseFloat(r.estimatedReduction.split(' ')[0]);
    }, 0);
    
    const totalCostSavings = completed.reduce((sum: number, r: any) => {
      const savings = r.costSavings.replace(/[^0-9]/g, '');
      return sum + (parseInt(savings) || 0);
    }, 0);

    const completionRate = recommendations.length > 0 ? (completed.length / recommendations.length) * 100 : 0;

    // Calculate average time to complete (simplified)
    const completedWithDates = completed.filter((r: any) => r.startedDate && r.completedDate);
    const averageTimeToComplete = completedWithDates.length > 0 
      ? completedWithDates.reduce((sum: number, r: any) => {
          const start = new Date(r.startedDate);
          const end = new Date(r.completedDate);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
        }, 0) / completedWithDates.length
      : 0;

    setStats({
      totalRecommendations: recommendations.length,
      completedRecommendations: completed.length,
      inProgressRecommendations: inProgress.length,
      totalCO2Saved,
      totalCostSavings,
      completionRate,
      averageTimeToComplete
    });
  }, [user?.id]);

  const statCards = [
    {
      title: 'Total Recommendations',
      value: stats.totalRecommendations,
      icon: Target,
      color: 'blue',
      suffix: ''
    },
    {
      title: 'Completed',
      value: stats.completedRecommendations,
      icon: CheckCircle,
      color: 'green',
      suffix: ''
    },
    {
      title: 'CO2 Saved',
      value: stats.totalCO2Saved.toFixed(1),
      icon: TrendingUp,
      color: 'emerald',
      suffix: ' tons'
    },
    {
      title: 'Money Saved',
      value: stats.totalCostSavings.toLocaleString(),
      icon: Award,
      color: 'yellow',
      suffix: '',
      prefix: '$'
    },
    {
      title: 'Completion Rate',
      value: stats.completionRate.toFixed(0),
      icon: BarChart3,
      color: 'purple',
      suffix: '%'
    },
    {
      title: 'Avg. Time to Complete',
      value: stats.averageTimeToComplete.toFixed(0),
      icon: Clock,
      color: 'orange',
      suffix: ' days'
    }
  ];

  if (stats.totalRecommendations === 0) {
    return null;
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Recommendation Progress</h3>
          <p className="text-sm text-slate-600">Track your climate action journey</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="p-4 glass rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="text-lg font-bold text-slate-900">
                    {stat.prefix}{stat.value}{stat.suffix}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
          <span className="text-sm text-slate-600">{stats.completionRate.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}