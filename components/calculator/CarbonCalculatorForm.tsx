'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Plane, 
  Home, 
  Utensils, 
  ShoppingBag,
  Recycle,
  Calculator,
  Save,
  RotateCcw
} from 'lucide-react';
import TransportationForm from './TransportationForm';
import EnergyForm from './EnergyForm';
import FoodForm from './FoodForm';
import ShoppingForm from './ShoppingForm';
import WasteForm from './WasteForm';
import AIRecommendations from '../recommendations/AIRecommendations';
import RecommendationTracker from '../recommendations/RecommendationTracker';
import { calculateCarbonFootprint, CarbonData, CarbonResults } from '@/lib/carbonCalculations';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CarbonCalculatorForm() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('transportation');
  const [carbonData, setCarbonData] = useState<CarbonData>({
    transportation: {
      carMiles: 0,
      carType: 'gasoline',
      publicTransportHours: 0,
      flightHours: 0,
      walkingCyclingHours: 0
    },
    energy: {
      homeSize: 'medium',
      electricityBill: 0,
      heatingType: 'gas',
      coolingHours: 0,
      renewableEnergy: false
    },
    food: {
      dietType: 'omnivore',
      meatMealsPerWeek: 7,
      localFoodPercentage: 30,
      foodWastePercentage: 20,
      organicPercentage: 10
    },
    shopping: {
      clothingFrequency: 'monthly',
      electronicsFrequency: 'yearly',
      sustainableChoices: 30,
      secondHandPercentage: 10
    },
    waste: {
      recyclingPercentage: 50,
      composting: false,
      wasteReduction: 20
    }
  });

  const [results, setResults] = useState<CarbonResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const categories = [
    { id: 'transportation', name: 'Transportation', icon: Car, color: 'red' },
    { id: 'energy', name: 'Energy', icon: Home, color: 'yellow' },
    { id: 'food', name: 'Food', icon: Utensils, color: 'green' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'purple' },
    { id: 'waste', name: 'Waste', icon: Recycle, color: 'blue' }
  ];

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(`carbonData_${user?.id}`);
    if (savedData) {
      try {
        setCarbonData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved carbon data:', error);
      }
    }

    // Load saved results
    const savedResults = localStorage.getItem(`carbonResults_${user?.id}`);
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
        setShowRecommendations(true);
      } catch (error) {
        console.error('Error loading saved results:', error);
      }
    }
  }, [user?.id]);

  const updateCategoryData = (category: string, data: any) => {
    setCarbonData(prev => ({
      ...prev,
      [category]: { ...prev[category as keyof CarbonData], ...data }
    }));
  };

  const saveData = () => {
    if (user?.id) {
      localStorage.setItem(`carbonData_${user.id}`, JSON.stringify(carbonData));
      
      // Also save to calculation history
      const history = JSON.parse(localStorage.getItem(`carbonHistory_${user.id}`) || '[]');
      const newEntry = {
        date: new Date().toISOString(),
        data: carbonData,
        results: results
      };
      history.unshift(newEntry);
      
      // Keep only last 10 calculations
      if (history.length > 10) {
        history.splice(10);
      }
      
      localStorage.setItem(`carbonHistory_${user.id}`, JSON.stringify(history));
      toast.success('Data saved successfully!');
    }
  };

  const resetData = () => {
    setCarbonData({
      transportation: {
        carMiles: 0,
        carType: 'gasoline',
        publicTransportHours: 0,
        flightHours: 0,
        walkingCyclingHours: 0
      },
      energy: {
        homeSize: 'medium',
        electricityBill: 0,
        heatingType: 'gas',
        coolingHours: 0,
        renewableEnergy: false
      },
      food: {
        dietType: 'omnivore',
        meatMealsPerWeek: 7,
        localFoodPercentage: 30,
        foodWastePercentage: 20,
        organicPercentage: 10
      },
      shopping: {
        clothingFrequency: 'monthly',
        electronicsFrequency: 'yearly',
        sustainableChoices: 30,
        secondHandPercentage: 10
      },
      waste: {
        recyclingPercentage: 50,
        composting: false,
        wasteReduction: 20
      }
    });
    setResults(null);
    setShowRecommendations(false);
    
    // Clear saved data
    if (user?.id) {
      localStorage.removeItem(`carbonData_${user.id}`);
      localStorage.removeItem(`carbonResults_${user.id}`);
    }
    
    toast.success('Data reset successfully!');
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const calculationResults = calculateCarbonFootprint(carbonData);
    setResults(calculationResults);
    setShowRecommendations(true);
    setIsCalculating(false);
    
    // Save results
    if (user?.id) {
      localStorage.setItem(`carbonResults_${user.id}`, JSON.stringify(calculationResults));
    }
    
    toast.success('Carbon footprint calculated!');
  };

  const renderCategoryForm = () => {
    switch (activeCategory) {
      case 'transportation':
        return (
          <TransportationForm
            data={carbonData.transportation}
            updateData={(data) => updateCategoryData('transportation', data)}
          />
        );
      case 'energy':
        return (
          <EnergyForm
            data={carbonData.energy}
            updateData={(data) => updateCategoryData('energy', data)}
          />
        );
      case 'food':
        return (
          <FoodForm
            data={carbonData.food}
            updateData={(data) => updateCategoryData('food', data)}
          />
        );
      case 'shopping':
        return (
          <ShoppingForm
            data={carbonData.shopping}
            updateData={(data) => updateCategoryData('shopping', data)}
          />
        );
      case 'waste':
        return (
          <WasteForm
            data={carbonData.waste}
            updateData={(data) => updateCategoryData('waste', data)}
          />
        );
      default:
        return null;
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
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Carbon Footprint Calculator</h2>
        <p className="text-slate-600">
          Track your environmental impact and get AI-powered recommendations
        </p>
      </motion.div>

      {/* Recommendation Tracker */}
      <RecommendationTracker />

      {/* Category Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`card text-center transition-all duration-300 ${
                activeCategory === category.id 
                  ? 'ring-2 ring-emerald-500 bg-emerald-50/50' 
                  : 'hover:bg-white/40'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 text-${category.color}-600`} />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{category.name}</h3>
            </motion.button>
          );
        })}
      </div>

      {/* Category Form */}
      <motion.div
        key={activeCategory}
        className="card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderCategoryForm()}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={saveData}
          className="btn-secondary flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Data</span>
        </button>
        
        <button
          onClick={resetData}
          className="btn-secondary flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
        
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="btn-primary flex items-center space-x-2"
        >
          {isCalculating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              <span>Calculate Footprint</span>
            </>
          )}
        </button>
      </div>

      {/* Results Display */}
      {results && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Total Footprint */}
          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Annual Carbon Footprint</h3>
            <p className="text-4xl font-bold text-emerald-600 mb-2">
              {results.total.toFixed(1)} tons CO2
            </p>
            <p className="text-slate-600">
              {results.total > 4 ? 'Above' : results.total > 2 ? 'Near' : 'Below'} global average (4 tons/year)
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Breakdown by Category</h3>
            <div className="space-y-4">
              {Object.entries(results.breakdown).map(([category, value]) => {
                const categoryInfo = categories.find(c => c.id === category);
                const Icon = categoryInfo?.icon || Car;
                const percentage = (value / results.total) * 100;
                
                return (
                  <div key={category} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 bg-${categoryInfo?.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${categoryInfo?.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900 capitalize">{category}</span>
                        <span className="text-sm text-slate-600">{value.toFixed(1)} tons ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <motion.div
                          className={`bg-${categoryInfo?.color}-500 h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Global Average</h4>
              <p className="text-2xl font-bold text-slate-600">4.0 tons</p>
            </div>
            <div className="card text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Paris Agreement Target</h4>
              <p className="text-2xl font-bold text-blue-600">2.3 tons</p>
            </div>
            <div className="card text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Your Goal</h4>
              <p className="text-2xl font-bold text-emerald-600">
                {((user?.carbonGoal || 2000) / 1000).toFixed(1)} tons
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Recommendations */}
      {showRecommendations && (
        <AIRecommendations 
          carbonData={carbonData} 
          results={results}
          onRecommendationUpdate={(recs) => {
            // Handle recommendation updates if needed
          }}
        />
      )}
    </div>
  );
}