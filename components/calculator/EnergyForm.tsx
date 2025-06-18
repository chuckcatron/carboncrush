'use client';

import { Home, Zap, Thermometer, Wind } from 'lucide-react';

interface EnergyData {
  homeSize: string;
  electricityBill: number;
  heatingType: string;
  coolingHours: number;
  renewableEnergy: boolean;
}

interface EnergyFormProps {
  data: EnergyData;
  updateData: (data: Partial<EnergyData>) => void;
}

export default function EnergyForm({ data, updateData }: EnergyFormProps) {
  const homeSizes = [
    { value: 'small', label: 'Small (< 1,000 sq ft)', multiplier: 0.7 },
    { value: 'medium', label: 'Medium (1,000-2,000 sq ft)', multiplier: 1.0 },
    { value: 'large', label: 'Large (2,000-3,000 sq ft)', multiplier: 1.5 },
    { value: 'very-large', label: 'Very Large (> 3,000 sq ft)', multiplier: 2.0 }
  ];

  const heatingTypes = [
    { value: 'gas', label: 'Natural Gas', emissions: 'Medium' },
    { value: 'electric', label: 'Electric', emissions: 'Varies' },
    { value: 'oil', label: 'Heating Oil', emissions: 'High' },
    { value: 'heat-pump', label: 'Heat Pump', emissions: 'Low' },
    { value: 'wood', label: 'Wood/Biomass', emissions: 'Medium' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-yellow-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Home Energy</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Size */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Home Details</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Home Size
            </label>
            <select
              value={data.homeSize}
              onChange={(e) => updateData({ homeSize: e.target.value })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            >
              {homeSizes.map(size => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Monthly electricity bill ($)
            </label>
            <input
              type="number"
              value={data.electricityBill}
              onChange={(e) => updateData({ electricityBill: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              placeholder="e.g., 120"
              min="0"
            />
          </div>
        </div>

        {/* Heating & Cooling */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Thermometer className="w-4 h-4" />
            <span>Heating & Cooling</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Primary heating source
            </label>
            <select
              value={data.heatingType}
              onChange={(e) => updateData({ heatingType: e.target.value })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            >
              {heatingTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} ({type.emissions} emissions)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Air conditioning hours per day (summer)
            </label>
            <input
              type="number"
              value={data.coolingHours}
              onChange={(e) => updateData({ coolingHours: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              placeholder="e.g., 8"
              min="0"
              max="24"
            />
          </div>
        </div>

        {/* Renewable Energy */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2 mb-4">
            <Wind className="w-4 h-4" />
            <span>Renewable Energy</span>
          </h4>
          
          <div className="flex items-center space-x-3 p-4 glass rounded-xl">
            <input
              type="checkbox"
              id="renewableEnergy"
              checked={data.renewableEnergy}
              onChange={(e) => updateData({ renewableEnergy: e.target.checked })}
              className="w-5 h-5 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <label htmlFor="renewableEnergy" className="text-sm font-medium text-slate-900">
              I use renewable energy (solar panels, green energy plan, etc.)
            </label>
          </div>
          
          {data.renewableEnergy && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                🌱 Great! Renewable energy can reduce your home energy emissions by 50-100%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Energy Efficiency Tips */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <h5 className="font-semibold text-yellow-900 mb-2">⚡ Energy Saving Tips</h5>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• LED bulbs use 75% less energy than incandescent bulbs</li>
          <li>• Smart thermostats can reduce heating/cooling costs by 10-15%</li>
          <li>• Proper insulation can cut energy bills by 20-30%</li>
          <li>• Unplugging devices when not in use prevents phantom energy draw</li>
        </ul>
      </div>
    </div>
  );
}