'use client';

import { motion } from 'framer-motion';
import { 
  Building2, 
  Handshake, 
  TrendingUp, 
  Users,
  Award,
  Star,
  ExternalLink,
  MapPin,
  Phone,
  Globe,
  Leaf,
  Crown,
  Zap
} from 'lucide-react';
import { useState } from 'react';

interface Partner {
  id: string;
  name: string;
  type: 'featured' | 'premium' | 'standard';
  category: string;
  logo: string;
  description: string;
  offer: string;
  discount: string;
  rating: number;
  reviews: number;
  website: string;
  location: string;
  sustainabilityScore: number;
  commission: number; // Revenue share percentage
}

export default function BusinessPartnerships() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const partners: Partner[] = [
    {
      id: 'tesla',
      name: 'Tesla',
      type: 'featured',
      category: 'transport',
      logo: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=100',
      description: 'Leading electric vehicle manufacturer committed to sustainable transport',
      offer: '$1,000 off Model 3 or Model Y',
      discount: '5% off',
      rating: 4.8,
      reviews: 12450,
      website: 'tesla.com',
      location: 'Nationwide',
      sustainabilityScore: 95,
      commission: 8
    },
    {
      id: 'sunrun',
      name: 'Sunrun Solar',
      type: 'premium',
      category: 'energy',
      logo: 'https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=100',
      description: 'America\'s largest residential solar company',
      offer: 'Free solar consultation + $500 credit',
      discount: '10% off installation',
      rating: 4.6,
      reviews: 8920,
      website: 'sunrun.com',
      location: 'Nationwide',
      sustainabilityScore: 92,
      commission: 12
    },
    {
      id: 'patagonia',
      name: 'Patagonia',
      type: 'premium',
      category: 'retail',
      logo: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100',
      description: 'Sustainable outdoor clothing and gear',
      offer: '15% off sustainable clothing line',
      discount: '15% off',
      rating: 4.7,
      reviews: 15670,
      website: 'patagonia.com',
      location: 'Online + Stores',
      sustainabilityScore: 98,
      commission: 6
    },
    {
      id: 'impossible',
      name: 'Impossible Foods',
      type: 'standard',
      category: 'food',
      logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100',
      description: 'Plant-based meat alternatives',
      offer: '$5 off first order',
      discount: '20% off',
      rating: 4.4,
      reviews: 5430,
      website: 'impossiblefoods.com',
      location: 'Select stores',
      sustainabilityScore: 89,
      commission: 10
    }
  ];

  const categories = [
    { id: 'all', name: 'All Partners', icon: Building2 },
    { id: 'transport', name: 'Transport', icon: Zap },
    { id: 'energy', name: 'Energy', icon: Leaf },
    { id: 'retail', name: 'Retail', icon: Star },
    { id: 'food', name: 'Food', icon: Users }
  ];

  const getPartnerBadge = (type: string) => {
    switch (type) {
      case 'featured':
        return { icon: Crown, color: 'yellow', label: 'Featured Partner' };
      case 'premium':
        return { icon: Star, color: 'purple', label: 'Premium Partner' };
      default:
        return { icon: Handshake, color: 'blue', label: 'Partner' };
    }
  };

  const filteredPartners = partners.filter(partner => 
    selectedCategory === 'all' || partner.category === selectedCategory
  );

  const totalRevenue = partners.reduce((sum, partner) => {
    // Simulate monthly revenue based on commission and estimated sales
    const estimatedMonthlySales = partner.type === 'featured' ? 50000 : 
                                 partner.type === 'premium' ? 25000 : 10000;
    return sum + (estimatedMonthlySales * partner.commission / 100);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="card text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
          <Handshake className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Partner Marketplace</h2>
        <p className="text-slate-600">
          Discover exclusive deals from sustainable brands and earn rewards for your climate actions
        </p>
      </motion.div>

      {/* Revenue Dashboard */}
      <motion.div
        className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Partnership Revenue</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Monthly Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{partners.length}</p>
            <p className="text-sm text-slate-600">Active Partners</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">12.5%</p>
            <p className="text-sm text-slate-600">Avg Commission</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">2,450</p>
            <p className="text-sm text-slate-600">Monthly Conversions</p>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/50 hover:bg-white/70 text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPartners.map((partner, index) => {
          const badge = getPartnerBadge(partner.type);
          const BadgeIcon = badge.icon;
          
          return (
            <motion.div
              key={partner.id}
              className={`card transition-all duration-300 ${
                partner.type === 'featured' 
                  ? 'ring-2 ring-yellow-400 shadow-xl' 
                  : 'hover:shadow-lg'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{partner.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{partner.rating}</span>
                          <span>({partner.reviews.toLocaleString()})</span>
                        </div>
                        <span>•</span>
                        <span>{partner.location}</span>
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-700`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{partner.description}</p>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 mb-3">
                    <p className="font-semibold text-emerald-800 text-sm">{partner.offer}</p>
                    <p className="text-emerald-600 text-xs">Exclusive for CarbonCrush users</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">{partner.sustainabilityScore}% Green</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600 font-medium">{partner.commission}% commission</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <a 
                        href={`https://${partner.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        <span>Visit Store</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Partnership Benefits */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Partnership Benefits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: 'Engaged Audience',
              description: 'Access to 50K+ climate-conscious users actively seeking sustainable products'
            },
            {
              icon: TrendingUp,
              title: 'Performance Tracking',
              description: 'Real-time analytics on clicks, conversions, and revenue attribution'
            },
            {
              icon: Award,
              title: 'Brand Alignment',
              description: 'Partner with a mission-driven platform that shares your sustainability values'
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA for New Partners */}
      <motion.div
        className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Handshake className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Become a Partner</h3>
        <p className="text-slate-600 mb-4">
          Join our marketplace and reach thousands of eco-conscious customers
        </p>
        <button className="btn-primary">
          Apply for Partnership
        </button>
      </motion.div>
    </div>
  );
}