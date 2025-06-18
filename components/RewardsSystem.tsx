'use client';

import { motion } from 'framer-motion';
import { 
  Award, 
  Star, 
  Gift, 
  Trophy,
  Medal,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  Lock
} from 'lucide-react';

export default function RewardsSystem() {
  const userStats = {
    totalPoints: 1247,
    level: 8,
    nextLevelPoints: 1500,
    streak: 12,
    completedActions: 47
  };

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first carbon calculation',
      points: 50,
      icon: Target,
      unlocked: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Maintain a 7-day action streak',
      points: 100,
      icon: Calendar,
      unlocked: true,
      date: '2024-01-22'
    },
    {
      id: 3,
      title: 'Community Champion',
      description: 'Join your first community challenge',
      points: 150,
      icon: Trophy,
      unlocked: true,
      date: '2024-01-28'
    },
    {
      id: 4,
      title: 'Carbon Crusher',
      description: 'Reduce footprint by 25%',
      points: 300,
      icon: TrendingUp,
      unlocked: false,
      progress: 78
    },
    {
      id: 5,
      title: 'Eco Legend',
      description: 'Reach 2000 total points',
      points: 500,
      icon: Crown,
      unlocked: false,
      progress: 62
    },
    {
      id: 6,
      title: 'Planet Protector',
      description: 'Complete 100 climate actions',
      points: 1000,
      icon: Medal,
      unlocked: false,
      progress: 47
    }
  ];

  const rewards = [
    {
      id: 1,
      title: '$10 Green Energy Credit',
      description: 'Apply to your next electricity bill',
      cost: 500,
      category: 'Energy',
      available: true,
      claimed: false
    },
    {
      id: 2,
      title: 'Sustainable Products Bundle',
      description: 'Eco-friendly household items worth $50',
      cost: 800,
      category: 'Lifestyle',
      available: true,
      claimed: false
    },
    {
      id: 3,
      title: 'Carbon Offset Certificate',
      description: 'Offset 1 ton of CO2 emissions',
      cost: 1000,
      category: 'Offset',
      available: true,
      claimed: true
    },
    {
      id: 4,
      title: 'Electric Vehicle Discount',
      description: '$500 off your next EV purchase',
      cost: 1200,
      category: 'Transport',
      available: false,
      claimed: false
    },
    {
      id: 5,
      title: 'Solar Panel Consultation',
      description: 'Free home solar assessment',
      cost: 1500,
      category: 'Energy',
      available: false,
      claimed: false
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Energy': return 'bg-yellow-100 text-yellow-700';
      case 'Transport': return 'bg-blue-100 text-blue-700';
      case 'Lifestyle': return 'bg-purple-100 text-purple-700';
      case 'Offset': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="card text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Rewards & Achievements</h2>
        <p className="text-slate-600">
          Earn points, unlock achievements, and redeem real-world rewards
        </p>
      </motion.div>

      {/* User Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Points', value: userStats.totalPoints.toLocaleString(), icon: Star, color: 'yellow' },
          { label: 'Current Level', value: userStats.level, icon: Trophy, color: 'purple' },
          { label: 'Action Streak', value: `${userStats.streak} days`, icon: Zap, color: 'orange' },
          { label: 'Actions Completed', value: userStats.completedActions, icon: CheckCircle, color: 'green' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Level Progress */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Level {userStats.level}</h3>
            <p className="text-sm text-slate-600">
              {userStats.nextLevelPoints - userStats.totalPoints} points to next level
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Progress</p>
            <p className="text-lg font-bold text-slate-900">
              {Math.round((userStats.totalPoints / userStats.nextLevelPoints) * 100)}%
            </p>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(userStats.totalPoints / userStats.nextLevelPoints) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'glass border-white/30 opacity-75'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : 'bg-slate-200'
                  }`}>
                    {achievement.unlocked ? (
                      <Icon className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-slate-600 mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-600">
                        +{achievement.points} points
                      </span>
                      {achievement.unlocked ? (
                        <span className="text-xs text-slate-500">{achievement.date}</span>
                      ) : (
                        achievement.progress && (
                          <span className="text-xs text-slate-500">{achievement.progress}%</span>
                        )
                      )}
                    </div>
                    {!achievement.unlocked && achievement.progress && (
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                        <div 
                          className="bg-emerald-500 h-1 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Rewards Store */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Rewards Store</h3>
            <p className="text-sm text-slate-600">Redeem your points for real rewards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                reward.claimed 
                  ? 'bg-gray-50 border-gray-200 opacity-60' 
                  : reward.available 
                    ? 'glass border-white/30 hover:bg-white/40' 
                    : 'glass border-white/30 opacity-75'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: reward.available && !reward.claimed ? 1.02 : 1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{reward.title}</h4>
                  <p className="text-sm text-slate-600">{reward.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reward.category)}`}>
                  {reward.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-slate-900">{reward.cost} points</span>
                </div>
                
                {reward.claimed ? (
                  <span className="text-green-600 font-medium text-sm">Claimed</span>
                ) : reward.available ? (
                  <button 
                    className={`text-sm py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                      userStats.totalPoints >= reward.cost
                        ? 'btn-primary'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                    disabled={userStats.totalPoints < reward.cost}
                  >
                    {userStats.totalPoints >= reward.cost ? 'Redeem' : 'Not Enough Points'}
                  </button>
                ) : (
                  <span className="text-slate-500 font-medium text-sm">Locked</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}