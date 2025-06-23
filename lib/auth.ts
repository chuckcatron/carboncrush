import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export const authOptions: NextAuthOptions = {
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
          const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);
          
          if (!user.length) {
            console.log('User not found');
            return null;
          }

          console.log('User found, checking password');
          console.log('Stored hash starts with:', user[0].password.substring(0, 10));
          
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
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
    signUp: '/auth',
  },
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}