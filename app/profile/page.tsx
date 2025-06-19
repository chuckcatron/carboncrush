'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/profile/UserProfile';
import BoltAttribution from '@/components/BoltAttribution';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Bolt Attribution */}
        <BoltAttribution />

        {/* Header */}
        <header className="glass sticky top-0 z-40 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-slate-900">Profile</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserProfile />
        </main>
      </div>
    </ProtectedRoute>
  );
}