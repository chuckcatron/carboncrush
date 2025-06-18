'use client';

import { useAuth } from '@/contexts/AuthContext';
import LandingPage from './landing/page';
import MainApp from './main/page';

export default function Home() {
  const { user } = useAuth();

  // Show landing page if user is not logged in
  if (!user) {
    return <LandingPage />;
  }

  // Show main app if user is logged in
  return <MainApp />;
}