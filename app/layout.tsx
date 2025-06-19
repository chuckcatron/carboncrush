import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import NextAuthProvider from '@/components/providers/NextAuthProvider';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CarbonCrush - Climate Action Platform',
  description: 'Track, reduce, and offset your carbon footprint through gamification and AI recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}