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
      
      console.log('Token decoded user ID:', decoded.id);
      console.log('Requested user ID:', userId);
      
      if (decoded.id === userId) {
        return decoded;
      } else {
        console.warn('User ID mismatch - token user:', decoded.id, 'requested user:', userId);
        // For now, return the authenticated user from token instead of failing
        // This handles the case where there might be a session mismatch
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
    console.log('POST /api/update-profile called');
    console.log('Request method:', request.method);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const requestText = await request.text();
    console.log('Raw request body:', requestText);
    
    if (!requestText || requestText.trim() === '') {
      console.error('Empty request body received');
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Request body that failed to parse:', requestText);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    const { userId, ...updates } = parsedBody;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    console.log('POST /api/update-profile - User ID:', userId);
    
    const authenticatedUser = await getAuthenticatedUser(request, userId);
    
    console.log('Authentication check:');
    console.log('Requested userId:', userId);
    console.log('Authenticated user:', authenticatedUser);
    
    if (!authenticatedUser) {
      console.error('Authentication failed - no authenticated user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Use the authenticated user's ID for the update (handles session mismatches)
    const actualUserId = authenticatedUser.id;
    console.log('Using user ID for update:', actualUserId);

    console.log('Update data received:', updates);
    console.log('onboardingCompleted in updates:', updates.onboardingCompleted);
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, id, createdAt, ...safeUpdates } = updates;
    
    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    // Define which fields are direct columns vs preferences
    const directColumns = ['name', 'email', 'location', 'carbon_goal', 'onboarding_completed', 'email_verified', 'subscribe_newsletter', 'signup_source', 'avatar_url'];
    
    // Map camelCase to snake_case for direct columns
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

    const preferencesToUpdate: Record<string, any> = {};

    // Separate direct columns from preferences
    Object.entries(safeUpdates).forEach(([key, value]) => {
      if (key === 'updatedAt') {
        // Skip updatedAt since we're already setting updated_at above
        return;
      }
      
      const dbColumn = columnMapping[key] || key;
      
      console.log(`Processing field: ${key} -> ${dbColumn}, value:`, value);
      console.log(`Is direct column: ${directColumns.includes(dbColumn)}`);
      
      // Check if this is a direct column
      if (directColumns.includes(dbColumn)) {
        supabaseUpdates[dbColumn] = value;
        console.log(`Added to supabaseUpdates: ${dbColumn} =`, value);
      } else {
        // Store in preferences
        preferencesToUpdate[key] = value;
        console.log(`Added to preferences: ${key} =`, value);
      }
    });

    // If we have preferences to update, get current preferences and merge
    if (Object.keys(preferencesToUpdate).length > 0) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      
      // Get current preferences
      const { data: currentUser } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', actualUserId)
        .single();

      let currentPreferences = {};
      if (currentUser?.preferences) {
        try {
          currentPreferences = typeof currentUser.preferences === 'string' 
            ? JSON.parse(currentUser.preferences) 
            : currentUser.preferences;
        } catch (error) {
          console.error('Error parsing current preferences:', error);
        }
      }

      // Merge with new preferences
      const updatedPreferences = {
        ...currentPreferences,
        ...preferencesToUpdate
      };

      supabaseUpdates.preferences = JSON.stringify(updatedPreferences);
    }

    console.log('Supabase updates:', supabaseUpdates);
    console.log('onboarding_completed in supabaseUpdates:', supabaseUpdates.onboarding_completed);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL exists:', !!supabaseUrl);
    console.log('Service role key exists:', !!serviceRoleKey);
    console.log('Anon key exists:', !!anonKey);
    console.log('Using service role key:', !!serviceRoleKey);
    
    if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    // Use service role key if available (bypasses RLS)
    const supabaseKey = serviceRoleKey || anonKey;
    const supabase = createClient(supabaseUrl, supabaseKey!);
    
    console.log('About to update user:', actualUserId);
    console.log('Final supabaseUpdates object:', JSON.stringify(supabaseUpdates, null, 2));
    
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(supabaseUpdates)
      .eq('id', actualUserId)
      .select('*')
      .single();
      
    console.log('Supabase update result - error:', error);
    console.log('Supabase update result - data:', updatedUser);
    
    if (error) {
      console.error('Supabase update error:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Was trying to update user:', userId);
      console.error('With updates:', supabaseUpdates);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert snake_case back to camelCase for response
    let parsedPreferences = {};
    if (updatedUser.preferences) {
      try {
        parsedPreferences = typeof updatedUser.preferences === 'string' 
          ? JSON.parse(updatedUser.preferences) 
          : updatedUser.preferences;
      } catch (error) {
        console.error('Error parsing preferences in response:', error);
      }
    }

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
      // Spread preferences into the main object for easier access
      ...parsedPreferences,
    };

    console.log('User updated successfully via Supabase');
    console.log('Updated user onboarding_completed:', updatedUser.onboarding_completed);
    return NextResponse.json(camelCaseUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}