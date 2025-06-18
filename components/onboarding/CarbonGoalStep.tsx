'use client';

import { motion } from 'framer-motion';
import { Target, TrendingDown, ChevronRight, ChevronLeft } from 'lucide-react';

interface CarbonGoalStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function CarbonGoalStep({ 
  data, 
  updateData, 
  onNext, 
  onPrevious 
}: CarbonGoalStepProps) {
  const goals = [
    {
      value: 3000,
      label: 'Beginner',
      description: 'Start with small changes',
      reduction: '10-20%',
      color: 'blue'
    },
    {
      value: 2000,
      label: 'Committed',
      description: 'Make meaningful impact',
      reduction: '30-40%',
      color: 'emerald'
    },
    {
      value: 1500,
      label: 'Champion',
      description: 'Lead by example',
      reduction: '50-60%',
      color: 'purple'
    },
    {
      value: 1000,
      label: 'Hero',
      description: 'Maximum impact lifestyle',
      reduction: '70%+',
      color: 'orange'
    }
  ];

  const averageFootprint = 4000; // kg CO2 per year (US average)

  return (
    <div className="card">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Set Your Carbon Goal</h2>
        <p className="text-slate-600">
          Choose your annual carbon footprint target. The average American produces about 4 tons of CO2 per year.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {goals.map((goal, index) => (
          <motion.button
            key={goal.value}
            type="button"
            onClick={() => updateData({ carbonGoal: goal.value })}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              data.carbonGoal === goal.value
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-white/30 glass hover:bg-white/40'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-3 h-3 bg-${goal.color}-500 rounded-full`} />
                  <h3 className="font-semibold text-slate-900">{goal.label}</h3>
                  <span className="text-sm text-slate-500">
                    {(goal.value / 1000).toFixed(1)} tons CO2/year
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>{goal.reduction} reduction</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">
                  {Math.round(((averageFootprint - goal.value) / averageFootprint) * 100)}%
                </div>
                <div className="text-xs text-slate-500">vs average</div>
              </div>
            </div>
            
            {/* Progress bar showing goal vs average */}
            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`bg-${goal.color}-500 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${(goal.value / averageFootprint) * 100}%` }}
                />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom Goal */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Or set a custom goal (kg CO2 per year)
        </label>
        <input
          type="number"
          value={data.carbonGoal || 2000}
          onChange={(e) => updateData({ carbonGoal: parseInt(e.target.value) || 2000 })}
          min="500"
          max="5000"
          step="100"
          className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
        />
        <p className="mt-1 text-xs text-slate-500">
          Recommended range: 1,000 - 3,000 kg CO2 per year
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          className="btn-secondary flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          className="btn-primary flex items-center space-x-2"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}