'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ChevronRight, ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AccountSetupStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function AccountSetupStep({ 
  data, 
  updateData, 
  onNext, 
  onPrevious 
}: AccountSetupStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name?.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!data.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(data.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    try {
      // Store the account data for now, we'll create the account at the end of onboarding
      updateData({
        name: data.name,
        email: data.email,
        password: data.password,
        accountCreated: false
      });
      
      toast.success('Account details saved! Let\'s continue with your profile.');
      onNext();
    } catch (error) {
      console.error('Account setup error:', error);
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsCreating(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'bg-red-500' },
      { strength: 2, label: 'Weak', color: 'bg-orange-500' },
      { strength: 3, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 4, label: 'Good', color: 'bg-blue-500' },
      { strength: 5, label: 'Strong', color: 'bg-green-500' }
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(data.password || '');

  return (
    <div className="card">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Create Your Account</h2>
        <p className="text-slate-600">
          Set up your CarbonCrush account to track your progress and join the community
        </p>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Full Name
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => updateData({ name: e.target.value })}
            className={`w-full px-4 py-3 glass rounded-xl border transition-all duration-300 ${
              errors.name 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-white/30 focus:ring-emerald-500 focus:border-emerald-500'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => updateData({ email: e.target.value.toLowerCase().trim() })}
            className={`w-full px-4 py-3 glass rounded-xl border transition-all duration-300 ${
              errors.email 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-white/30 focus:ring-emerald-500 focus:border-emerald-500'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Lock className="w-4 h-4 inline mr-1" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password || ''}
              onChange={(e) => updateData({ password: e.target.value })}
              className={`w-full px-4 py-3 pr-12 glass rounded-xl border transition-all duration-300 ${
                errors.password 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-white/30 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {data.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-slate-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                {passwordStrength.label && (
                  <span className={`text-xs font-medium ${
                    passwordStrength.strength >= 4 ? 'text-green-600' : 
                    passwordStrength.strength >= 3 ? 'text-blue-600' :
                    passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Use at least 8 characters with a mix of letters, numbers, and symbols
              </p>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Lock className="w-4 h-4 inline mr-1" />
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={data.confirmPassword || ''}
              onChange={(e) => updateData({ confirmPassword: e.target.value })}
              className={`w-full px-4 py-3 pr-12 glass rounded-xl border transition-all duration-300 ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-white/30 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {data.confirmPassword && data.password === data.confirmPassword && (
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Passwords match
            </p>
          )}
          
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Terms */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onPrevious}
          className="btn-secondary flex items-center space-x-2"
          disabled={isCreating}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={isCreating}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}