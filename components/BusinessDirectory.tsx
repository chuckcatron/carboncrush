'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Leaf, 
  Phone,
  Globe,
  Clock,
  Filter,
  Search,
  ChevronRight,
  Award,
  Zap,
  Car,
  Utensils,
  Home,
  ShoppingBag
} from 'lucide-react';
import { useState } from 'react';

export default function BusinessDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: Globe },
    { id: 'food', name: 'Food & Dining', icon: Utensils },
    { id: 'transport', name: 'Transportation', icon: Car },
    { id: 'energy', name: 'Energy', icon: Zap },
    { id: 'retail', name: 'Retail', icon: ShoppingBag },
    { id: 'services', name: 'Services', icon: Home }
  ];

  const businesses = [
    {
      id: 1,
      name: 'Green Leaf Bistro',
      category: 'food',
      rating: 4.8,
      reviews: 324,
      distance: '0.3 miles',
      address: '123 Eco Street, Green City',
      phone: '(555) 123-4567',
      website: 'greenleafbistro.com',
      hours: 'Open until 10 PM',
      sustainabilityScore: 95,
      certifications: ['Organic', 'Local Sourcing', 'Zero Waste'],
      description: 'Farm-to-table restaurant with 100% organic ingredients and zero waste practices.',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'EcoRide Car Share',
      category: 'transport',
      rating: 4.6,
      reviews: 189,
      distance: '0.5 miles',
      address: '456 Clean Ave, Green City',
      phone: '(555) 234-5678',
      website: 'ecoride.com',
      hours: '24/7 Available',
      sustainabilityScore: 92,
      certifications: ['Electric Fleet', 'Carbon Neutral'],
      description: 'Electric vehicle sharing service with solar-powered charging stations.',
      image: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Solar Solutions Pro',
      category: 'energy',
      rating: 4.9,
      reviews: 156,
      distance: '1.2 miles',
      address: '789 Renewable Rd, Green City',
      phone: '(555) 345-6789',
      website: 'solarsolutionspro.com',
      hours: 'Open until 6 PM',
      sustainabilityScore: 98,
      certifications: ['NABCEP Certified', 'B-Corp'],
      description: 'Professional solar panel installation with 25-year warranty and financing options.',
      image: 'https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Sustainable Style',
      category: 'retail',
      rating: 4.7,
      reviews: 267,
      distance: '0.8 miles',
      address: '321 Fashion St, Green City',
      phone: '(555) 456-7890',
      website: 'sustainablestyle.com',
      hours: 'Open until 8 PM',
      sustainabilityScore: 89,
      certifications: ['Fair Trade', 'Organic Cotton', 'Recycled Materials'],
      description: 'Eco-friendly clothing store featuring sustainable fashion brands and upcycled items.',
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      name: 'Green Clean Services',
      category: 'services',
      rating: 4.5,
      reviews: 98,
      distance: '1.5 miles',
      address: '654 Service Blvd, Green City',
      phone: '(555) 567-8901',
      website: 'greencleanservices.com',
      hours: 'Open until 5 PM',
      sustainabilityScore: 87,
      certifications: ['Non-Toxic Products', 'Green Seal'],
      description: 'Professional cleaning service using only eco-friendly, non-toxic products.',
      image: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      name: 'Urban Harvest Market',
      category: 'food',
      rating: 4.8,
      reviews: 445,
      distance: '0.7 miles',
      address: '987 Market St, Green City',
      phone: '(555) 678-9012',
      website: 'urbanharvest.com',
      hours: 'Open until 9 PM',
      sustainabilityScore: 94,
      certifications: ['Organic', 'Local Farmers', 'Plastic-Free'],
      description: 'Organic grocery store supporting local farmers with plastic-free packaging.',
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const filteredBusinesses = businesses.filter(business => {
    const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSustainabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="card text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Sustainable Business Directory</h2>
        <p className="text-slate-600">
          Discover eco-friendly businesses in your area and support sustainable practices
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'glass hover:bg-white/40 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-slate-600">
          Found {filteredBusinesses.length} sustainable businesses
        </p>
        <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium">
          <Filter className="w-4 h-4" />
          <span>More Filters</span>
        </button>
      </motion.div>

      {/* Business Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBusinesses.map((business, index) => (
          <motion.div
            key={business.id}
            className="card hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex space-x-4">
              {/* Business Image */}
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Business Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{business.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{business.rating}</span>
                        <span>({business.reviews})</span>
                      </div>
                      <span>•</span>
                      <span>{business.distance}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSustainabilityColor(business.sustainabilityScore)}`}>
                    {business.sustainabilityScore}% Sustainable
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{business.description}</p>
                
                {/* Certifications */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {business.certifications.slice(0, 2).map((cert) => (
                    <span key={cert} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {cert}
                    </span>
                  ))}
                  {business.certifications.length > 2 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                      +{business.certifications.length - 2} more
                    </span>
                  )}
                </div>
                
                {/* Contact Info */}
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{business.hours}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700">
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700">
                      <Globe className="w-4 h-4" />
                      <span>Visit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="mt-4 pt-4 border-t border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{business.address}</span>
                </div>
                <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Own a Sustainable Business?</h3>
        <p className="text-slate-600 mb-4">
          Join our directory and connect with eco-conscious customers in your area
        </p>
        <button className="btn-primary">
          List Your Business
        </button>
      </motion.div>
    </div>
  );
}