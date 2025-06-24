import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('POST /api/user/[id]/update - User ID:', params.id);
    
    const authenticatedUser = await getAuthenticatedUser(request, params.id);
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    console.log('Update data received:', updates);
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, id, createdAt, ...safeUpdates } = updates;
    
    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    // Map camelCase to snake_case for Supabase
    const columnMapping: Record<string, string> = {
      onboardingCompleted: 'onboarding_completed',
      emailVerified: 'email_verified',
      subscribeNewsletter: 'subscribe_newsletter',
      signupSource: 'signup_source',
      avatarUrl: 'avatar_url',
      carbonGoal: 'carbon_goal',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    const supabaseUpdates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    // Convert camelCase to snake_case
    Object.entries(safeUpdates).forEach(([key, value]) => {
      const dbColumn = columnMapping[key] || key;
      // Don't add updatedAt since we're already setting updated_at above
      if (key !== 'updatedAt') {
        supabaseUpdates[dbColumn] = value;
      }
    });

    console.log('Supabase updates:', supabaseUpdates);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(supabaseUpdates)
      .eq('id', params.id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert snake_case back to camelCase for response
    const camelCaseUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      location: updatedUser.location,
      carbonGoal: updatedUser.carbon_goal,
      onboardingCompleted: updatedUser.onboarding_completed,
      emailVerified: updatedUser.email_verified,
      subscribeNewsletter: updatedUser.subscribe_newsletter,
      signupSource: updatedUser.signup_source,
      avatarUrl: updatedUser.avatar_url,
      preferences: updatedUser.preferences,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };

    console.log('User updated successfully via Supabase');
    return NextResponse.json(camelCaseUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}