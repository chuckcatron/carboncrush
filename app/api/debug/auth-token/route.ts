import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({
        hasToken: false,
        cookies: Object.fromEntries(
          Array.from(request.cookies.getAll()).map(cookie => [cookie.name, cookie.value])
        ),
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || 'J7DpgaKNQdWQdvf7hrI0imHDDk/HjBBG/snmulQzeUM='
      ) as any;

      return NextResponse.json({
        hasToken: true,
        tokenValid: true,
        userId: decoded.id,
        userEmail: decoded.email,
      });
    } catch (jwtError) {
      return NextResponse.json({
        hasToken: true,
        tokenValid: false,
        error: jwtError instanceof Error ? jwtError.message : 'JWT verification failed',
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    });
  }
}