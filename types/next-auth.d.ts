import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      onboardingCompleted: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    onboardingCompleted: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    emailVerified: boolean;
    onboardingCompleted: boolean;
  }
}