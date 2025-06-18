'use client';

import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Car, 
  Home, 
  Utensils, 
  Recycle,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function AIRecommendations() {
  const recommendations = [
    {
      id: 1,
      category: 'Transportation',
      title: 'Switch to Electric Vehicle',
      description: 'Based on your 200 miles/week driving, an EV could reduce your transport emissions by 75%',
      impact: '1.2 tons CO2/year',
      savings: '$1,200/year',
      difficulty: 'Medium',
      timeframe: '1-3 months',
      icon: Car,
      color: 'red',
      completed: false
    },
    {
      id: 2,
      category: 'Energy',
      title: 'Install Solar Panels',
      description: 'Your high electricity usage makes solar panels a perfect fit for maximum impact',
      impact: '0.8 tons CO2/year',
      savings: '$800/year',
      difficulty: 'High',
      timeframe: '3-6 months',
      icon: Home,
      color: 'yellow',
      completed: false
    },
    {
      id: 3,
      category: 'Diet',
      title: 'Reduce Meat Consumption',
      description: 'Try Meatless Mondays and plant-based alternatives 2 days per week',
      impact: '0.5 tons CO2/year',
      savings: '$300/year',
      difficulty: 'Easy',
      timeframe: '1 week',
      icon: Utensils,
      color: 'green',
      completed: true
    },
    {
      id: 4,
      category: 'Lifestyle',
      title: 'Improve Recycling Habits',
      description: 'Increase recycling rate from 40% to 80% and start composting organic waste',
      impact: '0.3 tons CO2/year',
      savings: '$150/year',
      difficulty: 'Easy',
      timeframe: '1 week',
      icon: Recycle,
      color: 'purple',
      completed: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">AI Recommendations</h3>
          <p className="text-sm text-slate-600">Personalized actions to reduce your carbon footprint</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={rec.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                rec.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'glass border-white/30 hover:bg-white/40'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 bg-${rec.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {rec.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Icon className={`w-5 h-5 text-${rec.color}-600`} />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                      <span className="text-xs text-slate-500 font-medium">{rec.category}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center space-x-1 text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>{rec.impact}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <DollarSign className="w-3 h-3" />
                      <span>{rec.savings}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Clock className="w-3 h-3" />
                      <span>{rec.timeframe}</span>
                    </div>
                  </div>
                </div>
                
                {!rec.completed && (
                  <button className="btn-secondary text-sm py-2 px-4">
                    Start
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-900">Total Potential Impact</h4>
            <p className="text-sm text-slate-600">Complete all recommendations</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">2.8 tons CO2</p>
            <p className="text-sm text-slate-600">$2,450 saved/year</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}