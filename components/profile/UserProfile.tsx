'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    carbonGoal: user?.carbonGoal || 2000
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      location: user?.location || '',
      carbonGoal: user?.carbonGoal || 2000
    });
    setIsEditing(false);
  };

  const stats = [
    {
      label: 'Current Goal',
      value: `${((user?.carbonGoal || 2000) / 1000).toFixed(1)} tons/year`,
      icon: Target,
      color: 'emerald'
    },
    {
      label: 'Member Since',
      value: (user as any)?.joinDate ? new Date((user as any).joinDate).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }) : 'Recently',
      icon: Calendar,
      color: 'blue'
    },
    {
      label: 'Progress',
      value: '67%',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-emerald-200 hover:bg-emerald-50 transition-colors">
                <Camera className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-slate-600">{user.email}</p>
              {user.location && (
                <div className="flex items-center space-x-1 text-slate-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{user.location}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="p-4 glass rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="font-semibold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            ) : (
              <p className="px-4 py-3 glass rounded-xl text-slate-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            ) : (
              <p className="px-4 py-3 glass rounded-xl text-slate-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                placeholder="City, State/Country"
              />
            ) : (
              <p className="px-4 py-3 glass rounded-xl text-slate-900">
                {user.location || 'Not specified'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Carbon Goal (kg CO2/year)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={formData.carbonGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, carbonGoal: parseInt(e.target.value) || 2000 }))}
                min="500"
                max="5000"
                step="100"
                className="w-full px-4 py-3 glass rounded-xl border border-white/30 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            ) : (
              <p className="px-4 py-3 glass rounded-xl text-slate-900">
                {((user.carbonGoal || 2000) / 1000).toFixed(1)} tons/year
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-slate-900 mb-6">Privacy & Preferences</h2>
        
        <div className="space-y-4">
          {[
            { key: 'notifications', label: 'Email Notifications', description: 'Receive updates about challenges and achievements' },
            { key: 'publicProfile', label: 'Public Profile', description: 'Allow others to see your profile and progress' },
            { key: 'shareProgress', label: 'Share Progress', description: 'Share your achievements on social media' }
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between p-4 glass rounded-xl">
              <div>
                <h3 className="font-medium text-slate-900">{pref.label}</h3>
                <p className="text-sm text-slate-600">{pref.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.preferences?.[pref.key as keyof typeof user.preferences] || false}
                  onChange={(e) => updateProfile({
                    preferences: {
                      ...((user.preferences as any) || {}),
                      [pref.key]: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}