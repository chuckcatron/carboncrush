import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    // Get auth token
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        error: 'No auth token found',
        cookies: Object.fromEntries(
          Array.from(request.cookies.getAll()).map(cookie => [cookie.name, cookie.value])
        ),
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || 'J7DpgaKNQdWQdvf7hrI0imHDDk/HjBBG/snmulQzeUM='
      ) as any;
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid token', 
        tokenError: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check localStorage simulation
    const userId = decoded.id;
    const localStorageKey = `recommendations_${userId}`;

    return NextResponse.json({
      authStatus: 'authenticated',
      userId: decoded.id,
      userEmail: decoded.email,
      localStorageKey,
      apiEndpoints: {
        generateRecommendations: '/api/recommendations (POST)',
        getRecommendations: '/api/recommendations (GET)',
        updateRecommendation: '/api/recommendations/[id] (PATCH)',
      },
      testInstructions: [
        '1. Generate recommendations first using the Generate button',
        '2. Check browser localStorage for the recommendations data',
        '3. Try clicking Start button on any recommendation',
        '4. Check browser console for logs',
        '5. Check if status updates in localStorage'
      ]
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    });
  }
}