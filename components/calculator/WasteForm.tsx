'use client';

import { Recycle, Trash2, Leaf, RotateCcw } from 'lucide-react';

interface WasteData {
  recyclingPercentage: number;
  composting: boolean;
  wasteReduction: number;
}

interface WasteFormProps {
  data: WasteData;
  updateData: (data: Partial<WasteData>) => void;
}

export default function WasteForm({ data, updateData }: WasteFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Recycle className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Waste Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recycling */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Recycle className="w-4 h-4" />
            <span>Recycling</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recycling rate (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.recyclingPercentage}
              onChange={(e) => updateData({ recyclingPercentage: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-slate-700">{data.recyclingPercentage}%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Percentage of recyclable materials you actually recycle
            </p>
          </div>
        </div>

        {/* Waste Reduction */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Waste Reduction</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Waste reduction efforts (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.wasteReduction}
              onChange={(e) => updateData({ wasteReduction: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span className="font-medium text-slate-700">{data.wasteReduction}%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Reusing items, avoiding single-use products, etc.
            </p>
          </div>
        </div>

        {/* Composting */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2 mb-4">
            <Leaf className="w-4 h-4" />
            <span>Composting</span>
          </h4>
          
          <div className="flex items-center space-x-3 p-4 glass rounded-xl">
            <input
              type="checkbox"
              id="composting"
              checked={data.composting}
              onChange={(e) => updateData({ composting: e.target.checked })}
              className="w-5 h-5 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <label htmlFor="composting" className="text-sm font-medium text-slate-900">
              I compost organic waste (food scraps, yard waste)
            </label>
          </div>
          
          {data.composting && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                🌱 Excellent! Composting can reduce household waste by 30% and creates valuable soil amendment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Waste Reduction Examples */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h5 className="font-semibold text-blue-900 mb-3">♻️ Waste Reduction Strategies</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h6 className="font-medium mb-1">Reduce:</h6>
            <ul className="space-y-1">
              <li>• Use reusable bags and containers</li>
              <li>• Choose products with minimal packaging</li>
              <li>• Buy only what you need</li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium mb-1">Reuse:</h6>
            <ul className="space-y-1">
              <li>• Repurpose containers and materials</li>
              <li>• Donate or sell items instead of discarding</li>
              <li>• Repair items when possible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 glass rounded-xl">
          <Recycle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-900">Recycling Impact</p>
          <p className="text-xs text-slate-600">Saves 3.3 tons CO2 per ton recycled</p>
        </div>
        <div className="text-center p-4 glass rounded-xl">
          <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-900">Composting Impact</p>
          <p className="text-xs text-slate-600">Reduces methane emissions by 50%</p>
        </div>
        <div className="text-center p-4 glass rounded-xl">
          <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-900">Waste Reduction</p>
          <p className="text-xs text-slate-600">Average person generates 4.5 lbs/day</p>
        </div>
      </div>
    </div>
  );
}