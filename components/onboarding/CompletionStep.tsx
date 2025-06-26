'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Target, Users, Award } from 'lucide-react';

interface CompletionStepProps {
  data: any;
  onComplete: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function CompletionStep({ 
  data, 
  onComplete, 
  onPrevious 
}: CompletionStepProps) {
  const nextSteps = [
    {
      icon: Target,
      title: 'Calculate Your Footprint',
      description: 'Get a detailed analysis of your current carbon impact'
    },
    {
      icon: Users,
      title: 'Join Community Challenges',
      description: 'Connect with others and participate in climate actions'
    },
    {
      icon: Award,
      title: 'Earn Your First Rewards',
      description: 'Complete actions and unlock sustainable rewards'
    }
  ];

  return (
    <div className="card text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
        className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">
          You&apos;re All Set! 🎉
        </h2>
        <p className="text-slate-600 mb-8 text-lg">
          Welcome to your personalized climate action journey. Here&apos;s what you can do next:
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div
        className="glass rounded-xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-semibold text-slate-900 mb-4">Your Profile Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="text-left">
            <span className="text-slate-600">Location:</span>
            <span className="ml-2 font-medium text-slate-900">{data.location}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-600">Household:</span>
            <span className="ml-2 font-medium text-slate-900">
              {data.householdSize} {data.householdSize === 1 ? 'person' : 'people'}
            </span>
          </div>
          <div className="text-left">
            <span className="text-slate-600">Transport:</span>
            <span className="ml-2 font-medium text-slate-900 capitalize">{data.transportMode}</span>
          </div>
          <div className="text-left">
            <span className="text-slate-600">Carbon Goal:</span>
            <span className="ml-2 font-medium text-emerald-600">
              {(data.carbonGoal / 1000).toFixed(1)} tons/year
            </span>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {nextSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              className="p-4 glass rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">{step.title}</h4>
              <p className="text-xs text-slate-600">{step.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          className="btn-secondary"
        >
          Previous
        </button>

        <motion.button
          onClick={onComplete}
          className="btn-primary inline-flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-5 h-5" />
          <span>Start My Journey</span>
        </motion.button>
      </div>
    </div>
  );
}