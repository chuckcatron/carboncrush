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
  ShoppingBag,
  Loader2,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types: string[];
  price_level?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface BusinessWithSustainability extends GooglePlace {
  sustainabilityScore: number;
  sustainabilityReasons: string[];
  category: string;
  distance?: string;
}

export default function BusinessDirectory() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [businesses, setBusinesses] = useState<BusinessWithSustainability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: Globe, keywords: ['sustainable', 'eco-friendly', 'green', 'organic'] },
    { id: 'food', name: 'Food & Dining', icon: Utensils, keywords: ['organic restaurant', 'farm to table', 'vegan', 'sustainable food', 'local food'] },
    { id: 'transport', name: 'Transportation', icon: Car, keywords: ['electric vehicle', 'bike shop', 'car sharing', 'public transport'] },
    { id: 'energy', name: 'Energy', icon: Zap, keywords: ['solar panels', 'renewable energy', 'energy efficiency', 'green energy'] },
    { id: 'retail', name: 'Retail', icon: ShoppingBag, keywords: ['sustainable fashion', 'eco-friendly products', 'zero waste store', 'thrift store'] },
    { id: 'services', name: 'Services', icon: Home, keywords: ['green cleaning', 'eco-friendly services', 'sustainable business'] }
  ];

  const searchGreenBusinesses = useCallback(async (location: string, category: string) => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/places/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          category,
          query: searchTerm
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search businesses');
      }

      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Error searching businesses:', error);
      toast.error('Failed to load businesses. Please try again.');
      // Fallback to mock data
      setBusinesses(getMockBusinesses());
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Set user location from onboarding
    if (user?.location) {
      setUserLocation(user.location);
      searchGreenBusinesses(user.location, selectedCategory);
    }
  }, [user?.location, selectedCategory, searchGreenBusinesses]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          searchGreenBusinessesByCoords(latitude, longitude, selectedCategory);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your current location');
          setIsLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const searchGreenBusinessesByCoords = async (lat: number, lng: number, category: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/places/search-by-coords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          category,
          query: searchTerm
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search businesses');
      }

      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Error searching businesses:', error);
      toast.error('Failed to load businesses. Please try again.');
      setBusinesses(getMockBusinesses());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockBusinesses = (): BusinessWithSustainability[] => [
    {
      place_id: 'mock-1',
      name: 'Green Leaf Bistro',
      formatted_address: '123 Eco Street, Green City',
      formatted_phone_number: '(555) 123-4567',
      website: 'https://greenleafbistro.com',
      rating: 4.8,
      user_ratings_total: 324,
      types: ['restaurant', 'food'],
      geometry: { location: { lat: 37.7749, lng: -122.4194 } },
      sustainabilityScore: 95,
      sustainabilityReasons: ['Organic ingredients', 'Local sourcing', 'Zero waste practices'],
      category: 'food',
      distance: '0.3 miles'
    },
    {
      place_id: 'mock-2',
      name: 'EcoRide Car Share',
      formatted_address: '456 Clean Ave, Green City',
      formatted_phone_number: '(555) 234-5678',
      website: 'https://ecoride.com',
      rating: 4.6,
      user_ratings_total: 189,
      types: ['car_rental', 'establishment'],
      geometry: { location: { lat: 37.7849, lng: -122.4094 } },
      sustainabilityScore: 92,
      sustainabilityReasons: ['Electric fleet', 'Carbon neutral', 'Solar charging'],
      category: 'transport',
      distance: '0.5 miles'
    }
  ];

  const filteredBusinesses = businesses.filter(business => {
    const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.formatted_address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSustainabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getPhotoUrl = (photoReference: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;
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
        <p className="text-slate-600 mb-4">
          Discover eco-friendly businesses near you powered by Google Places
        </p>
        {userLocation && (
          <p className="text-sm text-emerald-600 font-medium">
            📍 Searching near: {userLocation}
          </p>
        )}
      </motion.div>

      {/* Location Controls */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Location
            </label>
            <input
              type="text"
              placeholder="Enter city, address, or zip code"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchGreenBusinesses(userLocation, selectedCategory)}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => searchGreenBusinesses(userLocation, selectedCategory)}
              disabled={isLoading || !userLocation.trim()}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Search</span>
            </button>
            <button
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Navigation className="w-5 h-5" />
              <span>Use Current</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-slate-600">
          {isLoading ? 'Searching...' : `Found ${filteredBusinesses.length} sustainable businesses`}
        </p>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Powered by Google Places</span>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-lg font-medium text-slate-700">Finding green businesses...</span>
          </div>
        </div>
      )}

      {/* Business Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBusinesses.map((business, index) => (
            <motion.div
              key={business.place_id}
              className="card hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex space-x-4">
                {/* Business Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-100 to-teal-100">
                  {business.photos && business.photos[0] ? (
                    <img 
                      src={getPhotoUrl(business.photos[0].photo_reference)}
                      alt={business.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${business.photos && business.photos[0] ? 'hidden' : ''}`}>
                    <Leaf className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                
                {/* Business Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{business.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        {business.rating && (
                          <>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{business.rating}</span>
                              {business.user_ratings_total && (
                                <span>({business.user_ratings_total})</span>
                              )}
                            </div>
                            <span>•</span>
                          </>
                        )}
                        {business.distance && <span>{business.distance}</span>}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSustainabilityColor(business.sustainabilityScore)}`}>
                      {business.sustainabilityScore}% Green
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{business.formatted_address}</p>
                  
                  {/* Sustainability Reasons */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {business.sustainabilityReasons.slice(0, 2).map((reason) => (
                      <span key={reason} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        {reason}
                      </span>
                    ))}
                    {business.sustainabilityReasons.length > 2 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        +{business.sustainabilityReasons.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  {/* Contact Info */}
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      {business.opening_hours?.open_now !== undefined && (
                        <>
                          <Clock className="w-4 h-4" />
                          <span className={business.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}>
                            {business.opening_hours.open_now ? 'Open now' : 'Closed'}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {business.formatted_phone_number && (
                        <a 
                          href={`tel:${business.formatted_phone_number}`}
                          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call</span>
                        </a>
                      )}
                      {business.website && (
                        <a 
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Visit</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* View on Maps */}
              <div className="mt-4 pt-4 border-t border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>View on Google Maps</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${business.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    <span>Directions</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredBusinesses.length === 0 && userLocation && (
        <motion.div
          className="card text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Leaf className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No green businesses found</h3>
          <p className="text-slate-600 mb-4">
            Try expanding your search area or selecting a different category.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="btn-primary"
          >
            Show All Categories
          </button>
        </motion.div>
      )}

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