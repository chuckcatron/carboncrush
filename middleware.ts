import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function checkCustomAuth(request: NextRequest): boolean {
  // Check for custom auth token (Bolt environment)
  const token = request.cookies.get('auth-token')?.value;
  if (token) {
    try {
      jwt.verify(token, process.env.NEXTAUTH_SECRET || 'J7DpgaKNQdWQdvf7hrI0imHDDk/HjBBG/snmulQzeUM=');
      return true;
    } catch (error) {
      console.log('Custom token verification failed:', error);
    }
  }
  return false;
}

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check NextAuth token first
        if (token) return true;
        
        // Fallback to custom auth for Bolt environment
        return checkCustomAuth(req);
      },
    },
  }
);

export const config = {
  matcher: [
    // Protect these routes
    '/main/:path*',
    '/profile/:path*',
    '/api/user/:path*',
    '/api/recommendations/:path*',
  ],
};