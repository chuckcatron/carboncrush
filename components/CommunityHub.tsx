'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp,
  Medal,
  Crown,
  Star,
  Calendar,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function CommunityHub() {
  const challenges = [
    {
      id: 1,
      title: 'Car-Free Week Challenge',
      description: 'Go without driving for 7 days straight',
      participants: 1247,
      timeLeft: '3 days',
      reward: 500,
      difficulty: 'Medium',
      category: 'Transportation',
      progress: 65,
      joined: true
    },
    {
      id: 2,
      title: 'Zero Waste Weekend',
      description: 'Produce no waste for an entire weekend',
      participants: 892,
      timeLeft: '1 week',
      reward: 300,
      difficulty: 'Hard',
      category: 'Lifestyle',
      progress: 0,
      joined: false
    },
    {
      id: 3,
      title: 'Plant-Based Month',
      description: 'Eat only plant-based meals for 30 days',
      participants: 2156,
      timeLeft: '2 weeks',
      reward: 750,
      difficulty: 'Medium',
      category: 'Diet',
      progress: 23,
      joined: true
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'EcoWarrior23', points: 15420, badge: 'Crown', location: 'San Francisco' },
    { rank: 2, name: 'GreenGuru', points: 14890, badge: 'Medal', location: 'Portland' },
    { rank: 3, name: 'ClimateChamp', points: 14250, badge: 'Trophy', location: 'Seattle' },
    { rank: 4, name: 'SustainableSam', points: 13680, badge: 'Star', location: 'Denver' },
    { rank: 5, name: 'CarbonCrusher', points: 13120, badge: 'Star', location: 'Austin' },
    { rank: 47, name: 'You', points: 1247, badge: 'Star', location: 'Your City', isUser: true }
  ];

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Crown': return Crown;
      case 'Medal': return Medal;
      case 'Trophy': return Trophy;
      default: return Star;
    }
  };

  const getBadgeColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-blue-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
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
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Community Hub</h2>
        <p className="text-slate-600">
          Join challenges, compete with friends, and make climate action social
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Members', value: '12.4K', icon: Users, color: 'blue' },
          { label: 'CO2 Saved Together', value: '847 tons', icon: TrendingUp, color: 'green' },
          { label: 'Active Challenges', value: '23', icon: Target, color: 'purple' }
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

      {/* Active Challenges */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Active Challenges</h3>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                challenge.joined 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'glass border-white/30 hover:bg-white/40'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{challenge.title}</h4>
                  <p className="text-sm text-slate-600">{challenge.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-xs text-slate-500">{challenge.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{challenge.timeLeft}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{challenge.reward} pts</span>
                  </div>
                </div>
                
                {challenge.joined ? (
                  <span className="text-emerald-600 font-medium text-sm">Joined</span>
                ) : (
                  <button className="btn-primary text-sm py-2 px-4">Join Challenge</button>
                )}
              </div>

              {challenge.joined && challenge.progress > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">Progress</span>
                    <span className="text-xs font-medium text-slate-900">{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      className="bg-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${challenge.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Global Leaderboard</h3>
            <p className="text-sm text-slate-600">Top climate action champions</p>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboard.map((user, index) => {
            const BadgeIcon = getBadgeIcon(user.badge);
            return (
              <motion.div
                key={user.rank}
                className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
                  user.isUser 
                    ? 'bg-emerald-50 border-2 border-emerald-200' 
                    : 'glass hover:bg-white/40'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.rank}
                  </div>
                  <BadgeIcon className={`w-5 h-5 ${getBadgeColor(user.rank)}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${user.isUser ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {user.name}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{user.points.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">points</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}