import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
      return NextResponse.json({ error: 'No auth token found' });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || 'J7DpgaKNQdWQdvf7hrI0imHDDk/HjBBG/snmulQzeUM='
      ) as any;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token', tokenError: error });
    }

    // Check Supabase user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, onboarding_completed')
      .eq('id', decoded.id)
      .single();

    if (error) {
      return NextResponse.json({
        error: 'Database error',
        dbError: error.message,
        userId: decoded.id,
      });
    }

    return NextResponse.json({
      tokenData: {
        id: decoded.id,
        email: decoded.email,
        onboardingCompleted: decoded.onboardingCompleted,
      },
      databaseData: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboarding_completed: user.onboarding_completed,
      },
      mismatch: decoded.onboardingCompleted !== user.onboarding_completed,
      recommendation: user.onboarding_completed ? 'User should see main app' : 'User should see onboarding',
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    });
  }
}