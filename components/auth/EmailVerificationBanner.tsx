'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function EmailVerificationBanner() {
  const { user, session, resendVerificationEmail } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);

  // Show banner if user exists, email is not verified, and banner is visible
  if (!user || !session || user.email_verified || !isVisible) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsResending(true);
    const result = await resendVerificationEmail();
    
    if (result.success) {
      toast.success('Verification email sent! Check your inbox.');
    } else {
      toast.error(result.error || 'Failed to send verification email');
    }
    
    setIsResending(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Please verify your email address
                </p>
                <p className="text-xs text-blue-700">
                  We sent a verification link to <strong>{user.email}</strong>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDismiss}
                className="text-blue-400 hover:text-blue-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}