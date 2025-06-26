'use client';

import { motion } from 'framer-motion';
import { Leaf, Target, Users, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeStepProps {
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { user } = useAuth();

  const features = [
    {
      icon: Target,
      title: 'Track Your Impact',
      description: 'Monitor your carbon footprint with AI-powered insights'
    },
    {
      icon: Users,
      title: 'Join the Community',
      description: 'Connect with like-minded individuals on climate challenges'
    },
    {
      icon: Award,
      title: 'Earn Rewards',
      description: 'Get points and unlock real-world sustainable rewards'
    }
  ];

  return (
    <div className="card text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow"
      >
        <Leaf className="w-10 h-10 text-white" />
      </motion.div>

      <h1 className="text-3xl font-bold gradient-text mb-2">
        Welcome to CarbonCrush! 🌱
      </h1>
      
      <p className="text-slate-600 mb-8 text-lg">
        Let&apos;s set up your profile and start your journey toward a more sustainable lifestyle.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className="p-4 glass rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        onClick={onNext}
        className="btn-primary inline-flex items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Let&apos;s Get Started</span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </div>
  );
}