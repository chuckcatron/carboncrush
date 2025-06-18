'use client';

import { Utensils, Apple, Leaf, Trash2 } from 'lucide-react';

interface FoodData {
  dietType: string;
  meatMealsPerWeek: number;
  localFoodPercentage: number;
  foodWastePercentage: number;
  organicPercentage: number;
}

interface FoodFormProps {
  data: FoodData;
  updateData: (data: Partial<FoodData>) => void;
}

export default function FoodForm({ data, updateData }: FoodFormProps) {
  const dietTypes = [
    { value: 'vegan', label: 'Vegan', emissions: 'Very Low', description: 'Plant-based only' },
    { value: 'vegetarian', label: 'Vegetarian', emissions: 'Low', description: 'No meat, includes dairy/eggs' },
    { value: 'pescatarian', label: 'Pescatarian', emissions: 'Low-Medium', description: 'Fish but no meat' },
    { value: 'omnivore', label: 'Omnivore', emissions: 'Medium-High', description: 'Balanced diet with meat' },
    { value: 'high-meat', label: 'High Meat', emissions: 'High', description: 'Meat with most meals' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Utensils className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Food & Diet</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diet Type */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Utensils className="w-4 h-4" />
            <span>Diet Type</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Primary diet
            </label>
            <select
              value={data.dietType}
              onChange={(e) => updateData({ dietType: e.target.value })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            >
              {dietTypes.map(diet => (
                <option key={diet.value} value={diet.value}>
                  {diet.label} - {diet.emissions} emissions
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              {dietTypes.find(d => d.value === data.dietType)?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Meat meals per week
            </label>
            <input
              type="number"
              value={data.meatMealsPerWeek}
              onChange={(e) => updateData({ meatMealsPerWeek: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              placeholder="e.g., 7"
              min="0"
              max="21"
            />
            <p className="text-xs text-slate-500 mt-1">
              Including beef, pork, chicken, etc.
            </p>
          </div>
        </div>

        {/* Food Sources */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Apple className="w-4 h-4" />
            <span>Food Sources</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Local food percentage (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.localFoodPercentage}
              onChange={(e) => updateData({ localFoodPercentage: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-slate-700">{data.localFoodPercentage}%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Food grown/produced within 100 miles
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Organic food percentage (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.organicPercentage}
              onChange={(e) => updateData({ organicPercentage: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-slate-700">{data.organicPercentage}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Food Waste */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2 mb-4">
            <Trash2 className="w-4 h-4" />
            <span>Food Waste</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Food waste percentage (%)
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={data.foodWastePercentage}
              onChange={(e) => updateData({ foodWastePercentage: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0% (No waste)</span>
              <span className="font-medium text-slate-700">{data.foodWastePercentage}%</span>
              <span>50% (High waste)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Average household wastes 20-30% of food purchased
            </p>
          </div>
        </div>
      </div>

      {/* Food Impact Info */}
      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
        <h5 className="font-semibold text-green-900 mb-2">🌱 Food Impact Facts</h5>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Beef has 20x higher emissions than vegetables per calorie</li>
          <li>• Local food reduces transport emissions by up to 90%</li>
          <li>• Food waste accounts for 8% of global greenhouse gas emissions</li>
          <li>• Plant-based diets can reduce food emissions by 50-70%</li>
        </ul>
      </div>
    </div>
  );
}