'use client';

import { motion } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  TrendingUp, 
  Users, 
  Award,
  CheckCircle,
  X,
  Star,
  Sparkles,
  BarChart3,
  Target,
  Globe,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  color: string;
  icon: any;
}

export default function PremiumFeatures() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Climate Starter',
      price: 0,
      period: 'forever',
      description: 'Perfect for individuals starting their climate journey',
      color: 'emerald',
      icon: Zap,
      features: [
        { name: 'Basic carbon calculator', included: true },
        { name: '3 AI recommendations per month', included: true },
        { name: 'Community challenges', included: true },
        { name: 'Basic progress tracking', included: true },
        { name: 'Green business directory', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Unlimited AI recommendations', included: false },
        { name: 'Carbon offset marketplace', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom goals & targets', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Climate Pro',
      price: 9.99,
      period: 'month',
      description: 'For serious climate warriors who want to maximize their impact',
      color: 'blue',
      icon: TrendingUp,
      popular: true,
      features: [
        { name: 'Advanced carbon calculator', included: true },
        { name: 'Unlimited AI recommendations', included: true },
        { name: 'Detailed analytics & insights', included: true },
        { name: 'Carbon offset marketplace', included: true },
        { name: 'Custom goals & tracking', included: true },
        { name: 'Priority community features', included: true },
        { name: 'Export data & reports', included: true },
        { name: 'Email support', included: true },
        { name: 'Early access to features', included: true },
        { name: 'Team collaboration', included: false }
      ]
    },
    {
      id: 'business',
      name: 'Climate Business',
      price: 49.99,
      period: 'month',
      description: 'For businesses and organizations committed to sustainability',
      color: 'purple',
      icon: Crown,
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Team collaboration (up to 50 users)', included: true },
        { name: 'Business carbon tracking', included: true },
        { name: 'Custom branding', included: true },
        { name: 'API access', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'White-label options', included: true },
        { name: 'Priority support', included: true },
        { name: 'Compliance reporting', included: true }
      ]
    }
  ];

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);
    setSelectedPlan(planId);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would integrate with Stripe/payment processor
      toast.success(`Successfully upgraded to ${plans.find(p => p.id === planId)?.name}!`);
      
      // Update user's subscription status
      // await updateUserSubscription(planId);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Upgrade Your Climate Impact</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Unlock advanced features to accelerate your sustainability journey and maximize your environmental impact
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrentPlan = selectedPlan === plan.id;
          
          return (
            <motion.div
              key={plan.id}
              className={`relative card transition-all duration-300 ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 shadow-xl scale-105' 
                  : 'hover:shadow-lg hover:scale-102'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 bg-${plan.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-600">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-slate-900' : 'text-slate-400'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading || plan.id === 'free'}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  plan.id === 'free'
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary hover:bg-white/40'
                } ${isCurrentPlan ? 'opacity-50' : ''}`}
              >
                {isCurrentPlan ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : plan.id === 'free' ? (
                  'Current Plan'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Why Upgrade?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: 'Advanced Analytics',
              description: 'Deep insights into your carbon footprint trends, predictions, and personalized recommendations',
              color: 'blue'
            },
            {
              icon: Target,
              title: 'Carbon Offsetting',
              description: 'Access to verified carbon offset projects and automatic offsetting based on your footprint',
              color: 'green'
            },
            {
              icon: Users,
              title: 'Team Collaboration',
              description: 'Work together with family, friends, or colleagues to achieve collective climate goals',
              color: 'purple'
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 text-${benefit.color}-600`} />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Money Back Guarantee */}
      <motion.div
        className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">30-Day Money Back Guarantee</h3>
        <p className="text-slate-600">
          Not satisfied? Get a full refund within 30 days, no questions asked. We're confident you'll love the impact you can make.
        </p>
      </motion.div>
    </div>
  );
}