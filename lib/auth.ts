import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'J7DpgaKNQdWQdvf7hrI0imHDDk/HjBBG/snmulQzeUM=',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          console.log('Attempting login for:', credentials.email);
          
          // Check if we're in Bolt environment and use Supabase directly
          const isBolt = typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SUPABASE_URL;
          
          let user;
          
          if (isBolt && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            // Use Supabase client in Bolt environment
            const supabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            );
            
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', credentials.email.toLowerCase())
              .single();
            
            if (error || !data) {
              console.log('User not found via Supabase');
              return null;
            }
            
            user = [data];
          } else {
            // Use Drizzle ORM for local development
            user = await Promise.race([
              db.select().from(users).where(eq(users.email, credentials.email.toLowerCase())).limit(1),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database query timeout')), 10000)
              )
            ]) as any[];
          }
          
          if (!user || !user.length) {
            console.log('User not found');
            return null;
          }

          console.log('User found, checking password');
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user[0].password);
          console.log('Password valid:', isPasswordValid);
          
          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }

          console.log('Login successful for user:', user[0].email);
          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            emailVerified: user[0].emailVerified,
            onboardingCompleted: user[0].onboardingCompleted,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log('JWT callback - user:', !!user, 'token:', !!token);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.emailVerified = !!user.emailVerified;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - session:', !!session, 'token:', !!token);
      console.log('Session callback - token contents:', token);
      
      if (token && token.id) {
        session.user = {
          id: token.id as string,
          email: (token.email || session.user?.email) as string,
          name: (token.name || session.user?.name) as string,
          emailVerified: token.emailVerified as boolean,
          onboardingCompleted: token.onboardingCompleted as boolean,
        };
        console.log('Session callback - updated session.user:', session.user);
      } else {
        console.log('Session callback - no token ID found');
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  }
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}