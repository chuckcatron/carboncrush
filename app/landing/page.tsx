'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Target, 
  Users, 
  Award,
  TrendingUp,
  Zap,
  Car,
  Home,
  Utensils,
  Calculator,
  Lightbulb,
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  BarChart3,
  Shield,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import BoltAttribution from '@/components/BoltAttribution';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Calculator,
      title: 'Smart Carbon Calculator',
      description: 'Get precise measurements of your carbon footprint across transportation, energy, food, and lifestyle choices.',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Lightbulb,
      title: 'AI-Powered Recommendations',
      description: 'Receive personalized, actionable advice powered by artificial intelligence to reduce your environmental impact.',
      image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Users,
      title: 'Community Challenges',
      description: 'Join thousands of climate warriors in fun challenges that make sustainable living social and rewarding.',
      image: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Award,
      title: 'Real Rewards System',
      description: 'Earn points for climate actions and redeem them for real-world rewards like green energy credits and sustainable products.',
      image: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '2.3M', label: 'Tons CO2 Saved', icon: TrendingUp },
    { number: '89%', label: 'Users Reduce Footprint', icon: Target },
    { number: '4.8★', label: 'User Rating', icon: Star }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Environmental Scientist',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'CarbonCrush made it so easy to understand and reduce my carbon footprint. The AI recommendations are spot-on!'
    },
    {
      name: 'Marcus Johnson',
      role: 'Software Engineer',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The gamification aspect keeps me motivated. I\'ve reduced my emissions by 40% in just 6 months!'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Teacher',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Love the community challenges! My whole family is now competing to be the most eco-friendly.'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Reduce Your Impact',
      description: 'Cut your carbon footprint by up to 40% with personalized action plans'
    },
    {
      icon: Zap,
      title: 'Save Money',
      description: 'Most climate actions also save you money on energy, transport, and consumption'
    },
    {
      icon: Users,
      title: 'Join a Movement',
      description: 'Connect with like-minded individuals working toward a sustainable future'
    },
    {
      icon: Shield,
      title: 'Make a Difference',
      description: 'Every action counts toward fighting climate change and protecting our planet'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Bolt Attribution */}
      <BoltAttribution />

      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center pulse-glow">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">CarbonCrush</h1>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</Link>
                <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
                <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
              </nav>
              <Link href="/auth" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/onboarding" className="btn-primary">
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                Crush Your 
                <span className="gradient-text"> Carbon Footprint</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                The gamified platform that makes climate action fun, social, and rewarding. 
                Track your impact, get AI-powered recommendations, and join a community of climate warriors.
              </p>
              
              <div className="flex items-center justify-center space-x-4 mb-8 p-4 glass rounded-xl border border-white/30">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-1">Powered by</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">🧠 Claude (Anthropic)</span>
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">⚡ GPT-4o (OpenAI)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/onboarding" className="btn-primary text-lg py-4 px-8 flex items-center justify-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="btn-secondary text-lg py-4 px-8 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Join 50K+ users</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Climate action hero"
                  className="rounded-2xl shadow-2xl"
                />
                
                {/* Floating Stats */}
                <div className="absolute -top-4 -left-4 glass rounded-xl p-4 floating-animation">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">2.3 tons</p>
                      <p className="text-xs text-slate-600">CO2 saved</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 glass rounded-xl p-4 floating-animation" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">1,247 pts</p>
                      <p className="text-xs text-slate-600">Earned</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</p>
                  <p className="text-slate-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Fight Climate Change
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              CarbonCrush combines cutting-edge technology with behavioral science to make 
              sustainable living accessible, engaging, and rewarding for everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full p-6 rounded-xl text-left transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200' 
                        : 'glass hover:bg-white/40 border-2 border-transparent'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        activeFeature === index 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                          : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          activeFeature === index ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-slate-600">{feature.description}</p>
                        {feature.title === 'AI-Powered Recommendations' && (
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">🧠 Claude</span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">⚡ GPT-4o</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        activeFeature === index ? 'text-emerald-600 rotate-90' : 'text-slate-400'
                      }`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feature Image */}
            <motion.div
              key={activeFeature}
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={features[activeFeature].image}
                alt={features[activeFeature].title}
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose CarbonCrush?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join the movement that&apos;s making climate action accessible, rewarding, and effective for everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  className="card text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by Climate Warriors Worldwide
            </h2>
            <p className="text-xl text-slate-600">
              See what our community is saying about their climate action journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center space-x-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Crush Your Carbon Footprint?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join thousands of climate warriors making a real difference. Start your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding" className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>View Pricing</span>
              </Link>
            </div>

            <p className="text-emerald-100 mt-6 text-sm">
              Free forever • No credit card required • Join 50,000+ users
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">CarbonCrush</h3>
              </div>
              <p className="text-slate-400 mb-4">
                Making climate action fun, social, and rewarding for everyone.
              </p>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span>Built with</span>
                <a 
                  href="https://bolt.new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  bolt.new
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CarbonCrush. All rights reserved. Making the world more sustainable, one action at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}