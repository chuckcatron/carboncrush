'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Car, 
  Home, 
  Utensils, 
  Recycle,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  estimatedReduction: string;
  costSavings: string;
  steps: string[];
  tips: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  startedDate?: string;
  completedDate?: string;
}

interface AIRecommendationsProps {
  carbonData?: any;
  results?: any;
  onRecommendationUpdate?: (recommendations: Recommendation[]) => void;
}

export default function AIRecommendations({ carbonData, results, onRecommendationUpdate }: AIRecommendationsProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load saved recommendations
    if (user?.id) {
      const saved = localStorage.getItem(`recommendations_${user.id}`);
      if (saved) {
        try {
          setRecommendations(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading recommendations:', error);
        }
      }
    }
  }, [user?.id]);

  useEffect(() => {
    // Auto-generate recommendations when carbon data is available
    if (carbonData && results && recommendations.length === 0) {
      generateRecommendations();
    }
  }, [carbonData, results]);

  const generateRecommendations = async () => {
    if (!carbonData || !results) {
      toast.error('Please calculate your carbon footprint first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carbonData,
          results,
          userProfile: {
            location: user?.location,
            householdSize: 1, // Default for now
            carbonGoal: user?.carbonGoal
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await response.json();
      
      if (data.fallback) {
        toast.success('Recommendations generated (using fallback)');
      } else {
        toast.success('AI recommendations generated!');
      }

      const newRecommendations = data.recommendations.map((rec: any) => ({
        ...rec,
        status: 'not-started' as const
      }));

      setRecommendations(newRecommendations);
      saveRecommendations(newRecommendations);
      onRecommendationUpdate?.(newRecommendations);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
      toast.error('Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecommendations = (recs: Recommendation[]) => {
    if (user?.id) {
      localStorage.setItem(`recommendations_${user.id}`, JSON.stringify(recs));
    }
  };

  const updateRecommendationStatus = (id: string, status: Recommendation['status']) => {
    const updated = recommendations.map(rec => {
      if (rec.id === id) {
        const updatedRec = { 
          ...rec, 
          status,
          startedDate: status === 'in-progress' ? new Date().toISOString() : rec.startedDate,
          completedDate: status === 'completed' ? new Date().toISOString() : undefined
        };
        return updatedRec;
      }
      return rec;
    });

    setRecommendations(updated);
    saveRecommendations(updated);
    onRecommendationUpdate?.(updated);

    if (status === 'completed') {
      toast.success('Recommendation completed! 🎉');
    } else if (status === 'in-progress') {
      toast.success('Recommendation started!');
    }
  };

  const resetRecommendations = () => {
    setRecommendations([]);
    if (user?.id) {
      localStorage.removeItem(`recommendations_${user.id}`);
    }
    toast.success('Recommendations reset');
  };

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transportation': return Car;
      case 'energy': return Home;
      case 'food': return Utensils;
      case 'shopping': return ShoppingBag;
      case 'waste': return Recycle;
      default: return Lightbulb;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transportation': return 'red';
      case 'energy': return 'yellow';
      case 'food': return 'green';
      case 'shopping': return 'purple';
      case 'waste': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      default: return Clock;
    }
  };

  const completedCount = recommendations.filter(r => r.status === 'completed').length;
  const inProgressCount = recommendations.filter(r => r.status === 'in-progress').length;
  const totalReduction = recommendations
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + parseFloat(r.estimatedReduction.split(' ')[0]), 0);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">AI Recommendations</h3>
            <p className="text-sm text-slate-600">Personalized actions to reduce your carbon footprint</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {recommendations.length > 0 && (
            <button
              onClick={resetRecommendations}
              className="btn-secondary text-sm py-2 px-3 flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
          
          <button
            onClick={generateRecommendations}
            disabled={isLoading || !carbonData || !results}
            className="btn-primary text-sm py-2 px-3 flex items-center space-x-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!carbonData || !results ? (
        <div className="text-center py-8">
          <Lightbulb className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Ready for AI Recommendations?</h4>
          <p className="text-slate-600 mb-4">
            Complete your carbon footprint calculation to get personalized AI-powered recommendations.
          </p>
        </div>
      ) : recommendations.length === 0 && !isLoading ? (
        <div className="text-center py-8">
          <Lightbulb className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Get Personalized Recommendations</h4>
          <p className="text-slate-600 mb-4">
            Click "Generate" to get AI-powered recommendations based on your carbon footprint.
          </p>
        </div>
      ) : (
        <>
          {/* Progress Summary */}
          {recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Completed</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">CO2 Saved</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{totalReduction.toFixed(1)} tons</p>
              </div>
            </div>
          )}

          {/* Recommendations List */}
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => {
              const Icon = getCategoryIcon(recommendation.category);
              const StatusIcon = getStatusIcon(recommendation.status || 'not-started');
              const categoryColor = getCategoryColor(recommendation.category);
              const isExpanded = expandedCards.has(recommendation.id);
              
              return (
                <motion.div
                  key={recommendation.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    recommendation.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : recommendation.status === 'in-progress'
                      ? 'bg-blue-50 border-blue-200'
                      : 'glass border-white/30 hover:bg-white/40'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 bg-${categoryColor}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 text-${categoryColor}-600`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{recommendation.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{recommendation.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
                            {recommendation.difficulty}
                          </span>
                          <StatusIcon className={`w-5 h-5 ${
                            recommendation.status === 'completed' ? 'text-green-600' :
                            recommendation.status === 'in-progress' ? 'text-blue-600' : 'text-slate-400'
                          }`} />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-xs mb-3">
                        <div className="flex items-center space-x-1 text-emerald-600">
                          <TrendingUp className="w-3 h-3" />
                          <span>{recommendation.estimatedReduction}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-600">
                          <DollarSign className="w-3 h-3" />
                          <span>{recommendation.costSavings}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-purple-600">
                          <Clock className="w-3 h-3" />
                          <span>{recommendation.timeframe}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {recommendation.status !== 'completed' && (
                            <>
                              {recommendation.status === 'not-started' ? (
                                <button
                                  onClick={() => updateRecommendationStatus(recommendation.id, 'in-progress')}
                                  className="btn-primary text-sm py-1 px-3 flex items-center space-x-1"
                                >
                                  <Play className="w-3 h-3" />
                                  <span>Start</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateRecommendationStatus(recommendation.id, 'completed')}
                                  className="btn-primary text-sm py-1 px-3 flex items-center space-x-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Complete</span>
                                </button>
                              )}
                              
                              {recommendation.status === 'in-progress' && (
                                <button
                                  onClick={() => updateRecommendationStatus(recommendation.id, 'not-started')}
                                  className="btn-secondary text-sm py-1 px-3 flex items-center space-x-1"
                                >
                                  <Pause className="w-3 h-3" />
                                  <span>Pause</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        
                        <button
                          onClick={() => toggleCardExpansion(recommendation.id)}
                          className="text-slate-500 hover:text-slate-700 flex items-center space-x-1"
                        >
                          <span className="text-sm">Details</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <motion.div
                          className="mt-4 pt-4 border-t border-white/30"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h5 className="font-semibold text-slate-900 mb-2">Implementation Steps:</h5>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 mb-3">
                            {recommendation.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                          
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h6 className="font-medium text-blue-900 mb-1">💡 Pro Tip:</h6>
                            <p className="text-sm text-blue-800">{recommendation.tips}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}