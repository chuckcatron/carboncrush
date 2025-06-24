'use client';

import { motion } from 'framer-motion';
import { 
  Leaf, 
  TreePine, 
  Zap, 
  Factory,
  Globe,
  ShoppingCart,
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  Award
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CarbonProject {
  id: string;
  name: string;
  type: 'forestry' | 'renewable' | 'technology' | 'community';
  location: string;
  pricePerTon: number;
  totalTons: number;
  soldTons: number;
  rating: number;
  reviews: number;
  certification: string;
  description: string;
  image: string;
  impact: string;
  timeline: string;
  verified: boolean;
}

export default function CarbonOffsetMarketplace() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [offsetAmount, setOffsetAmount] = useState(1);

  const projects: CarbonProject[] = [
    {
      id: 'forest-1',
      name: 'Amazon Rainforest Conservation',
      type: 'forestry',
      location: 'Brazil',
      pricePerTon: 25,
      totalTons: 50000,
      soldTons: 12500,
      rating: 4.9,
      reviews: 1247,
      certification: 'VCS + CCB',
      description: 'Protecting 10,000 hectares of pristine Amazon rainforest while supporting indigenous communities',
      image: 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg?auto=compress&cs=tinysrgb&w=400',
      impact: 'Protects biodiversity and indigenous rights',
      timeline: '25 years',
      verified: true
    },
    {
      id: 'solar-1',
      name: 'Solar Farm Development India',
      type: 'renewable',
      location: 'Rajasthan, India',
      pricePerTon: 18,
      totalTons: 75000,
      soldTons: 23000,
      rating: 4.7,
      reviews: 892,
      certification: 'Gold Standard',
      description: 'Large-scale solar installation providing clean energy to rural communities',
      image: 'https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=400',
      impact: 'Powers 15,000 homes with clean energy',
      timeline: '20 years',
      verified: true
    },
    {
      id: 'tech-1',
      name: 'Direct Air Capture Facility',
      type: 'technology',
      location: 'Iceland',
      pricePerTon: 45,
      totalTons: 25000,
      soldTons: 8500,
      rating: 4.8,
      reviews: 456,
      certification: 'CDR Verified',
      description: 'Advanced technology that directly removes CO2 from the atmosphere and stores it permanently',
      image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=400',
      impact: 'Permanent CO2 removal from atmosphere',
      timeline: 'Permanent',
      verified: true
    },
    {
      id: 'community-1',
      name: 'Clean Cookstoves Kenya',
      type: 'community',
      location: 'Kenya',
      pricePerTon: 12,
      totalTons: 30000,
      soldTons: 18000,
      rating: 4.6,
      reviews: 2134,
      certification: 'Gold Standard',
      description: 'Providing efficient cookstoves to reduce deforestation and improve health outcomes',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
      impact: 'Improves health for 5,000 families',
      timeline: '10 years',
      verified: true
    }
  ];

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'forestry': return TreePine;
      case 'renewable': return Zap;
      case 'technology': return Factory;
      case 'community': return Globe;
      default: return Leaf;
    }
  };

  const getProjectColor = (type: string) => {
    switch (type) {
      case 'forestry': return 'green';
      case 'renewable': return 'yellow';
      case 'technology': return 'blue';
      case 'community': return 'purple';
      default: return 'emerald';
    }
  };

  const handlePurchaseOffset = async (projectId: string, tons: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const totalCost = tons * project.pricePerTon;
    
    try {
      // Simulate payment processing
      toast.success(`Successfully purchased ${tons} tons of carbon offsets for $${totalCost}!`);
      
      // In a real app, this would process payment and issue certificates
      
    } catch (error) {
      toast.error('Purchase failed. Please try again.');
    }
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
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Carbon Offset Marketplace</h2>
        <p className="text-slate-600">
          Offset your carbon footprint by supporting verified climate projects worldwide
        </p>
      </motion.div>

      {/* Quick Offset Calculator */}
      <motion.div
        className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Offset Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tons to Offset
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={offsetAmount}
              onChange={(e) => setOffsetAmount(parseFloat(e.target.value) || 1)}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <div className="w-full">
              <p className="text-sm text-slate-600 mb-2">Estimated Cost</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${(offsetAmount * 25).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-end">
            <button className="w-full btn-primary">
              Offset Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Project Categories */}
      <div className="flex flex-wrap gap-4 justify-center">
        {['all', 'forestry', 'renewable', 'technology', 'community'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full bg-white/50 hover:bg-white/70 text-slate-700 font-medium transition-all duration-300 capitalize"
          >
            {category === 'all' ? 'All Projects' : category}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => {
          const Icon = getProjectIcon(project.type);
          const color = getProjectColor(project.type);
          const progress = (project.soldTons / project.totalTons) * 100;
          
          return (
            <motion.div
              key={project.id}
              className="card hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <img 
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                {project.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Icon className={`w-3 h-3 text-${color}-600`} />
                  <span className="capitalize">{project.type}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{project.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{project.rating}</span>
                      <span>({project.reviews})</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Price per ton</p>
                    <p className="font-bold text-slate-900">${project.pricePerTon}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Certification</p>
                    <p className="font-bold text-slate-900">{project.certification}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Progress</span>
                    <span className="text-sm font-medium text-slate-900">
                      {project.soldTons.toLocaleString()} / {project.totalTons.toLocaleString()} tons
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="text-sm text-slate-600">
                    <p>{project.impact}</p>
                    <p>Timeline: {project.timeline}</p>
                  </div>
                  <button
                    onClick={() => handlePurchaseOffset(project.id, 1)}
                    className="btn-primary text-sm py-2 px-4 flex items-center space-x-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy Offsets</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust Indicators */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Why Trust Our Offsets?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Award,
              title: 'Verified Standards',
              description: 'All projects meet Gold Standard, VCS, or CDR verification requirements'
            },
            {
              icon: TrendingUp,
              title: 'Real Impact',
              description: 'Track the actual environmental impact of your offset purchases'
            },
            {
              icon: CheckCircle,
              title: 'Transparent Pricing',
              description: 'No hidden fees - see exactly where your money goes'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}