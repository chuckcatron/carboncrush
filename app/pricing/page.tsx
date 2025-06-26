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
  Shield,
  Leaf,
  Calculator,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import BoltAttribution from '@/components/BoltAttribution';

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
  cta: string;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Climate Starter',
      price: 0,
      period: 'forever',
      description: 'Perfect for individuals starting their climate journey',
      color: 'emerald',
      icon: Zap,
      cta: 'Get Started Free',
      features: [
        { name: 'Basic carbon calculator', included: true, description: 'Track your footprint across 5 categories' },
        { name: '3 AI recommendations per month', included: true, description: 'Personalized climate actions' },
        { name: 'Community challenges', included: true, description: 'Join group sustainability goals' },
        { name: 'Basic progress tracking', included: true, description: 'Monitor your improvements' },
        { name: 'Green business directory', included: true, description: 'Find sustainable businesses nearby' },
        { name: 'Mobile app access', included: true, description: 'Track on the go' },
        { name: 'Advanced analytics', included: false },
        { name: 'Unlimited AI recommendations', included: false },
        { name: 'Carbon offset marketplace', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom goals & targets', included: false },
        { name: 'Data export', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Climate Pro',
      price: isAnnual ? 8.33 : 9.99,
      period: 'month',
      description: 'For serious climate warriors who want to maximize their impact',
      color: 'blue',
      icon: TrendingUp,
      popular: true,
      cta: 'Start Pro Trial',
      features: [
        { name: 'Everything in Starter', included: true },
        { name: 'Advanced carbon calculator', included: true, description: 'Detailed tracking with 20+ categories' },
        { name: 'Unlimited AI recommendations', included: true, description: 'Powered by Claude AI' },
        { name: 'Detailed analytics & insights', included: true, description: 'Trends, predictions, and comparisons' },
        { name: 'Carbon offset marketplace', included: true, description: 'Purchase verified offsets' },
        { name: 'Custom goals & tracking', included: true, description: 'Set personalized targets' },
        { name: 'Priority community features', included: true, description: 'Early access to challenges' },
        { name: 'Export data & reports', included: true, description: 'PDF and CSV downloads' },
        { name: 'Email support', included: true, description: '24-hour response time' },
        { name: 'Early access to features', included: true, description: 'Beta testing opportunities' },
        { name: 'Team collaboration', included: false },
        { name: 'API access', included: false }
      ]
    },
    {
      id: 'business',
      name: 'Climate Business',
      price: isAnnual ? 41.67 : 49.99,
      period: 'month',
      description: 'For businesses and organizations committed to sustainability',
      color: 'purple',
      icon: Crown,
      cta: 'Contact Sales',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Team collaboration (up to 50 users)', included: true, description: 'Shared dashboards and goals' },
        { name: 'Business carbon tracking', included: true, description: 'Scope 1, 2, and 3 emissions' },
        { name: 'Custom branding', included: true, description: 'White-label options' },
        { name: 'API access', included: true, description: 'Integrate with your systems' },
        { name: 'Dedicated account manager', included: true, description: 'Personal support specialist' },
        { name: 'Custom integrations', included: true, description: 'Connect to your tools' },
        { name: 'Compliance reporting', included: true, description: 'ESG and sustainability reports' },
        { name: 'Priority support', included: true, description: '4-hour response time' },
        { name: 'Training & onboarding', included: true, description: 'Team workshops included' },
        { name: 'Advanced security', included: true, description: 'SSO and audit logs' },
        { name: 'Custom features', included: true, description: 'Tailored to your needs' }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How accurate is the carbon calculator?',
      answer: 'Our calculator uses industry-standard emission factors and is regularly updated with the latest climate science. It provides estimates accurate to within 10-15% for most users.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to Pro features until the end of your billing period.'
    },
    {
      question: 'Are the carbon offsets verified?',
      answer: 'All carbon offset projects in our marketplace are verified by recognized standards like Gold Standard, VCS, or CDR. We only work with reputable project developers.'
    },
    {
      question: 'Do you offer discounts for nonprofits?',
      answer: 'Yes! We offer 50% discounts for registered nonprofits and educational institutions. Contact our sales team for more information.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.'
    },
    {
      question: 'Is there a free trial for Pro plans?',
      answer: 'Yes, we offer a 14-day free trial for Climate Pro. No credit card required to start your trial.'
    }
  ];

  const handleGetStarted = (planId: string) => {
    if (planId === 'free') {
      window.location.href = '/auth';
    } else if (planId === 'business') {
      window.location.href = '/contact';
    } else {
      // Redirect to signup with plan selection
      window.location.href = `/auth?plan=${planId}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <BoltAttribution />

      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center pulse-glow">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">CarbonCrush</h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</Link>
              <Link href="/pricing" className="text-emerald-600 font-medium">Pricing</Link>
              <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
              <Link href="/auth" className="btn-secondary">Sign In</Link>
              <Link href="/auth" className="btn-primary">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Choose Your <span className="gradient-text">Climate Impact</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Start free and upgrade as you grow your sustainability journey. 
            Join thousands of climate warriors making a real difference.
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                Save 17%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            
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
                    {isAnnual && plan.price > 0 && (
                      <div className="text-sm text-emerald-600 font-medium">
                        ${(plan.price * 12).toFixed(0)} billed annually
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.slice(0, 6).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`text-sm ${feature.included ? 'text-slate-900' : 'text-slate-400'}`}>
                          {feature.name}
                        </span>
                        {feature.description && feature.included && (
                          <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <p className="text-sm text-slate-500 text-center">
                      +{plan.features.length - 6} more features
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleGetStarted(plan.id)}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary hover:bg-white/40'
                  }`}
                >
                  {plan.cta}
                </button>

                {plan.id === 'pro' && (
                  <p className="text-center text-xs text-slate-500 mt-2">
                    14-day free trial • No credit card required
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <motion.div
          className="card mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Compare All Features</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-medium text-slate-900">Features</th>
                  <th className="text-center py-4 px-4 font-medium text-slate-900">Starter</th>
                  <th className="text-center py-4 px-4 font-medium text-slate-900">Pro</th>
                  <th className="text-center py-4 px-4 font-medium text-slate-900">Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'Basic carbon calculator',
                  'AI recommendations',
                  'Community challenges',
                  'Progress tracking',
                  'Green business directory',
                  'Advanced analytics',
                  'Carbon offset marketplace',
                  'Custom goals & targets',
                  'Data export',
                  'Team collaboration',
                  'API access',
                  'Priority support'
                ].map((feature, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-700">{feature}</td>
                    <td className="py-3 px-4 text-center">
                      {index < 5 ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {index < 9 ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h4 className="font-semibold text-slate-900 mb-2">{faq.question}</h4>
                <p className="text-slate-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Start Your Climate Journey?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Join thousands of climate warriors who are already making a difference. 
            Start free and upgrade when you&apos;re ready to maximize your impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" className="btn-primary flex items-center justify-center space-x-2">
              <span>Start Free Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-secondary">
              Talk to Sales
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            No credit card required • 14-day Pro trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}