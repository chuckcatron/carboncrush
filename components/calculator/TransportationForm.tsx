'use client';

import { Car, Plane, Bus, Bike } from 'lucide-react';

interface TransportationData {
  carMiles: number;
  carType: string;
  publicTransportHours: number;
  flightHours: number;
  walkingCyclingHours: number;
}

interface TransportationFormProps {
  data: TransportationData;
  updateData: (data: Partial<TransportationData>) => void;
}

export default function TransportationForm({ data, updateData }: TransportationFormProps) {
  const carTypes = [
    { value: 'gasoline', label: 'Gasoline Car', emissions: 'High' },
    { value: 'hybrid', label: 'Hybrid Car', emissions: 'Medium' },
    { value: 'electric', label: 'Electric Car', emissions: 'Low' },
    { value: 'diesel', label: 'Diesel Car', emissions: 'High' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Car className="w-5 h-5 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Transportation</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Car Usage */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Car className="w-4 h-4" />
            <span>Personal Vehicle</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Miles driven per week
            </label>
            <input
              type="number"
              value={data.carMiles}
              onChange={(e) => updateData({ carMiles: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              placeholder="e.g., 150"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Vehicle Type
            </label>
            <select
              value={data.carType}
              onChange={(e) => updateData({ carType: e.target.value })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            >
              {carTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} ({type.emissions} emissions)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Public Transport */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Bus className="w-4 h-4" />
            <span>Public Transport</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hours per week (bus, train, subway)
            </label>
            <input
              type="number"
              value={data.publicTransportHours}
              onChange={(e) => updateData({ publicTransportHours: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              placeholder="e.g., 5"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        {/* Air Travel */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Plane className="w-4 h-4" />
            <span>Air Travel</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Flight hours per year
            </label>
            <input
              type="number"
              value={data.flightHours}
              onChange={(e) => updateData({ flightHours: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              placeholder="e.g., 20"
              min="0"
            />
            <p className="text-xs text-slate-500 mt-1">
              Domestic: ~2-6 hours, International: 8-15+ hours
            </p>
          </div>
        </div>

        {/* Active Transport */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Bike className="w-4 h-4" />
            <span>Walking & Cycling</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hours per week
            </label>
            <input
              type="number"
              value={data.walkingCyclingHours}
              onChange={(e) => updateData({ walkingCyclingHours: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              placeholder="e.g., 3"
              min="0"
              step="0.5"
            />
            <p className="text-xs text-emerald-600 mt-1">
              Zero emissions! Great for the planet and your health.
            </p>
          </div>
        </div>
      </div>

      {/* Transportation Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h5 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Electric vehicles can reduce transport emissions by 50-80%</li>
          <li>• Public transport typically has 45% lower emissions per mile</li>
          <li>• One round-trip flight can equal months of driving emissions</li>
          <li>• Combining trips and carpooling can significantly reduce impact</li>
        </ul>
      </div>
    </div>
  );
}