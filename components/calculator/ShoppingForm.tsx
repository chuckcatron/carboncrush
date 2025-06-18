'use client';

import { ShoppingBag, Shirt, Smartphone, Recycle } from 'lucide-react';

interface ShoppingData {
  clothingFrequency: string;
  electronicsFrequency: string;
  sustainableChoices: number;
  secondHandPercentage: number;
}

interface ShoppingFormProps {
  data: ShoppingData;
  updateData: (data: Partial<ShoppingData>) => void;
}

export default function ShoppingForm({ data, updateData }: ShoppingFormProps) {
  const frequencies = [
    { value: 'weekly', label: 'Weekly', multiplier: 52 },
    { value: 'monthly', label: 'Monthly', multiplier: 12 },
    { value: 'quarterly', label: 'Quarterly', multiplier: 4 },
    { value: 'yearly', label: 'Yearly', multiplier: 1 },
    { value: 'rarely', label: 'Rarely', multiplier: 0.5 }
  ];

  const electronicsFrequencies = [
    { value: 'yearly', label: 'Yearly', multiplier: 1 },
    { value: 'every-2-years', label: 'Every 2 years', multiplier: 0.5 },
    { value: 'every-3-years', label: 'Every 3 years', multiplier: 0.33 },
    { value: 'every-5-years', label: 'Every 5+ years', multiplier: 0.2 },
    { value: 'rarely', label: 'Rarely replace', multiplier: 0.1 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Shopping & Consumption</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clothing */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Shirt className="w-4 h-4" />
            <span>Clothing</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New clothing purchase frequency
            </label>
            <select
              value={data.clothingFrequency}
              onChange={(e) => updateData({ clothingFrequency: e.target.value })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            >
              {frequencies.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Second-hand/thrift purchases (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.secondHandPercentage}
              onChange={(e) => updateData({ secondHandPercentage: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-slate-700">{data.secondHandPercentage}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Electronics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Smartphone className="w-4 h-4" />
            <span>Electronics</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Electronics replacement frequency
            </label>
            <select
              value={data.electronicsFrequency}
              onChange={(e) => updateData({ electronicsFrequency: e.target.value })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            >
              {electronicsFrequencies.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Phones, laptops, tablets, etc.
            </p>
          </div>
        </div>

        {/* Sustainable Choices */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2 mb-4">
            <Recycle className="w-4 h-4" />
            <span>Sustainable Shopping</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sustainable/eco-friendly choices (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.sustainableChoices}
              onChange={(e) => updateData({ sustainableChoices: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-slate-700">{data.sustainableChoices}%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Eco-certified, recycled materials, sustainable brands, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Shopping Tips */}
      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
        <h5 className="font-semibold text-purple-900 mb-2">🛍️ Sustainable Shopping Tips</h5>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Fast fashion accounts for 10% of global carbon emissions</li>
          <li>• Buying second-hand reduces emissions by 80% compared to new</li>
          <li>• Keeping electronics longer dramatically reduces their carbon impact</li>
          <li>• Quality over quantity: durable items last longer and reduce waste</li>
        </ul>
      </div>
    </div>
  );
}