'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeStep from './WelcomeStep';
import PersonalInfoStep from './PersonalInfoStep';
import CarbonGoalStep from './CarbonGoalStep';
import CompletionStep from './CompletionStep';

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    location: '',
    carbonGoal: 2000,
    interests: [] as string[],
    transportMode: '',
    householdSize: 1
  });
  const { completeOnboarding } = useAuth();

  const steps = [
    { component: WelcomeStep, title: 'Welcome' },
    { component: PersonalInfoStep, title: 'Personal Info' },
    { component: CarbonGoalStep, title: 'Carbon Goal' },
    { component: CompletionStep, title: 'Complete' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding(onboardingData);
  };

  const updateOnboardingData = (data: Partial<typeof onboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              data={onboardingData}
              updateData={updateOnboardingData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onComplete={handleComplete}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}