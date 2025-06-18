'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Car, ChevronRight, ChevronLeft } from 'lucide-react';

interface PersonalInfoStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function PersonalInfoStep({ 
  data, 
  updateData, 
  onNext, 
  onPrevious 
}: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const interests = [
    'Renewable Energy',
    'Sustainable Transport',
    'Eco-friendly Diet',
    'Zero Waste',
    'Green Technology',
    'Climate Activism',
    'Sustainable Fashion',
    'Organic Gardening'
  ];

  const transportModes = [
    { id: 'car', label: 'Car', icon: Car },
    { id: 'public', label: 'Public Transport', icon: Users },
    { id: 'bike', label: 'Bike/Walk', icon: Users },
    { id: 'mixed', label: 'Mixed', icon: Car }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!data.transportMode) {
      newErrors.transportMode = 'Please select your primary transport mode';
    }

    if (data.householdSize < 1 || data.householdSize > 10) {
      newErrors.householdSize = 'Household size must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = data.interests || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i: string) => i !== interest)
      : [...currentInterests, interest];
    
    updateData({ interests: updatedInterests });
  };

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-2">Tell Us About Yourself</h2>
        <p className="text-slate-600">
          This helps us provide personalized recommendations for your climate journey
        </p>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location (City, State/Country)
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => updateData({ location: e.target.value })}
            className={`w-full px-4 py-3 glass rounded-xl border transition-all duration-300 ${
              errors.location 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-white/30 focus:ring-emerald-500 focus:border-emerald-500'
            }`}
            placeholder="e.g., San Francisco, CA"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Household Size */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Household Size
          </label>
          <select
            value={data.householdSize || 1}
            onChange={(e) => updateData({ householdSize: parseInt(e.target.value) })}
            className={`w-full px-4 py-3 glass rounded-xl border transition-all duration-300 ${
              errors.householdSize 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-white/30 focus:ring-emerald-500 focus:border-emerald-500'
            }`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
              <option key={size} value={size}>
                {size} {size === 1 ? 'person' : 'people'}
              </option>
            ))}
          </select>
          {errors.householdSize && (
            <p className="mt-1 text-sm text-red-600">{errors.householdSize}</p>
          )}
        </div>

        {/* Primary Transport Mode */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Primary Transportation Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            {transportModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => updateData({ transportMode: mode.id })}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    data.transportMode === mode.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-white/30 glass hover:bg-white/40'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">{mode.label}</span>
                </button>
              );
            })}
          </div>
          {errors.transportMode && (
            <p className="mt-1 text-sm text-red-600">{errors.transportMode}</p>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            What interests you most? (Optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  (data.interests || []).includes(interest)
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'glass hover:bg-white/40 text-slate-600 border-white/30'
                } border`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onPrevious}
          className="btn-secondary flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="btn-primary flex items-center space-x-2"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}