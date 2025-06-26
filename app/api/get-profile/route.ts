import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Force Node.js runtime for JWT and crypto support
export const runtime = 'nodejs';

async function getAuthenticatedUser(request: NextRequest, userId: string) {
  // Try custom auth token first (for Bolt environment)
  const token = request.cookies.get('auth-token')?.value;
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || 'J7DpgaKNQdWQdvf7hrI0imHDDk/HjBBG/snmulQzeUM='
      ) as any;
      
      if (decoded.id === userId) {
        return decoded;
      }
    } catch (error) {
      console.log('Custom token verification failed:', error);
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    console.log('GET profile for user:', userId);
    
    const authenticatedUser = await getAuthenticatedUser(request, userId);
    
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Auth check passed, fetching user from database...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const supabaseKey = serviceRoleKey || supabaseAnonKey;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    console.log('Using service role key:', !!serviceRoleKey);
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId);
    
    const user = users && users.length > 0 ? users[0] : null;
    
    console.log('Query result - users found:', users?.length || 0);
    console.log('User ID being queried:', userId);
    
    if (error) {
      console.error('Supabase error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
    }
    
    if (!user) {
      console.log('No user found with ID:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert snake_case to camelCase for response
    let parsedPreferences = {};
    if (user.preferences) {
      try {
        parsedPreferences = typeof user.preferences === 'string' 
          ? JSON.parse(user.preferences) 
          : user.preferences;
      } catch (error) {
        console.error('Error parsing preferences:', error);
      }
    }

    const camelCaseUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      location: user.location,
      carbonGoal: user.carbon_goal,
      onboardingCompleted: user.onboarding_completed,
      emailVerified: user.email_verified,
      subscribeNewsletter: user.subscribe_newsletter,
      signupSource: user.signup_source,
      avatarUrl: user.avatar_url,
      preferences: user.preferences,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      // Also include snake_case versions for compatibility
      onboarding_completed: user.onboarding_completed,
      email_verified: user.email_verified,
      carbon_goal: user.carbon_goal,
      subscribe_newsletter: user.subscribe_newsletter,
      signup_source: user.signup_source,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at,
      // Spread preferences into the main object for easier access
      ...parsedPreferences,
    };
    
    console.log('User fetched from Supabase - onboarding_completed:', user.onboarding_completed);
    return NextResponse.json(camelCaseUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}