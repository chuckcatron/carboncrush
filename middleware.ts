import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

function checkCustomAuth(request: NextRequest): boolean {
  // Check for custom auth token (Bolt environment)
  // In middleware, we can only check if the token exists
  // Actual verification happens in the API routes
  const token = request.cookies.get('auth-token')?.value;
  return !!token;
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