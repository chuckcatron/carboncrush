'use client';

import { motion } from 'framer-motion';
import { 
  Leaf, 
  Target, 
  Users, 
  Award,
  TrendingUp,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Zap,
  TreePine,
  Recycle,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import BoltAttribution from '@/components/BoltAttribution';

export default function AboutPage() {
  const stats = [
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '2.3M', label: 'Tons CO2 Saved', icon: TrendingUp },
    { number: '89%', label: 'Users Reduce Footprint', icon: Target },
    { number: '4.8★', label: 'User Rating', icon: Star }
  ];

  const values = [
    {
      icon: Target,
      title: 'Impact-Driven',
      description: 'Every feature we build is designed to create real, measurable environmental impact.'
    },
    {
      icon: Users,
      title: 'Community-First',
      description: 'We believe collective action is more powerful than individual efforts alone.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We use cutting-edge AI and technology to make sustainability accessible to everyone.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'We provide clear, science-based data and verified carbon offset projects.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former Tesla sustainability lead with 10+ years in clean tech',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google AI engineer passionate about climate solutions',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Dr. Elena Rodriguez',
      role: 'Chief Climate Officer',
      bio: 'Climate scientist with PhD from MIT, former IPCC contributor',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      bio: 'Product leader from Stripe, expert in user-centered design',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Company Founded',
      description: 'Started with a mission to make climate action accessible and rewarding'
    },
    {
      year: '2023',
      title: '1K Users',
      description: 'Reached our first thousand climate warriors in just 3 months'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Launched AI-powered recommendations using Anthropic Claude'
    },
    {
      year: '2024',
      title: '50K Users',
      description: 'Growing community of climate-conscious individuals and businesses'
    },
    {
      year: '2024',
      title: 'Carbon Marketplace',
      description: 'Launched verified carbon offset marketplace with 100+ projects'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'Expanding to serve climate warriors worldwide'
    }
  ];

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
              <Link href="/about" className="text-emerald-600 font-medium">About</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
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
            We&apos;re on a <span className="gradient-text">Mission</span> to Save Our Planet
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            CarbonCrush makes climate action fun, social, and rewarding. We&apos;re building the world&apos;s 
            largest community of climate warriors, one sustainable action at a time.
          </p>
          <div className="flex justify-center">
            <img 
              src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Climate action community"
              className="rounded-2xl shadow-2xl max-w-2xl w-full"
            />
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</p>
                <p className="text-slate-600">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          className="card mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Climate change is the defining challenge of our time, but individual action often feels 
                overwhelming and ineffective. We created CarbonCrush to change that.
              </p>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                By combining cutting-edge AI, gamification, and community features, we make it easy 
                and rewarding for anyone to reduce their carbon footprint and fight climate change.
              </p>
              <div className="space-y-3">
                {[
                  'Make climate action accessible to everyone',
                  'Provide science-based, personalized recommendations',
                  'Build the world\'s largest climate community',
                  'Create real, measurable environmental impact'
                ].map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-slate-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Team collaboration"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 glass rounded-xl p-4 floating-animation">
                <div className="flex items-center space-x-2">
                  <TreePine className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">2.3M tons</p>
                    <p className="text-xs text-slate-600">CO2 saved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="card text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium text-sm mb-2">{member.role}</p>
                <p className="text-slate-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          className="card mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="flex items-start space-x-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{milestone.year}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{milestone.title}</h3>
                  <p className="text-slate-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Section */}
        <motion.div
          className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Environmental Impact</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Together, our community has achieved remarkable environmental impact. 
              Here&apos;s what we&apos;ve accomplished so far:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: TreePine, number: '2.3M', label: 'Tons CO2 Saved', color: 'green' },
                { icon: Recycle, number: '1.2M', label: 'Waste Diverted', color: 'blue' },
                { icon: Zap, number: '850K', label: 'kWh Renewable Energy', color: 'yellow' }
              ].map((impact, index) => {
                const Icon = impact.icon;
                return (
                  <div key={impact.label} className="text-center">
                    <div className={`w-16 h-16 bg-${impact.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 text-${impact.color}-600`} />
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-2">{impact.number}</p>
                    <p className="text-slate-600">{impact.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Join Our Mission</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Ready to become a climate warrior? Join thousands of people who are already making 
            a difference for our planet. Every action counts, and together we can create real change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" className="btn-primary flex items-center justify-center space-x-2">
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-secondary">
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}