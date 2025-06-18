'use client';

import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-lg font-medium text-slate-700">Loading...</span>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // AuthPage will be shown by the main layout
  }

  return <>{children}</>;
}