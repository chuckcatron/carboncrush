import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const { userId, updates } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Test Supabase connection and update
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: 'Supabase not configured',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // First, try to fetch the user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({
        step: 'fetch_user',
        error: fetchError.message,
        code: fetchError.code,
      });
    }

    if (!existingUser) {
      return NextResponse.json({
        step: 'fetch_user',
        error: 'User not found',
      });
    }

    // Map camelCase to snake_case for updates
    const columnMapping: Record<string, string> = {
      onboardingCompleted: 'onboarding_completed',
      emailVerified: 'email_verified',
      subscribeNewsletter: 'subscribe_newsletter',
      signupSource: 'signup_source',
      avatarUrl: 'avatar_url',
      carbonGoal: 'carbon_goal',
    };

    const supabaseUpdates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    // Convert camelCase to snake_case
    Object.entries(updates).forEach(([key, value]) => {
      const dbColumn = columnMapping[key] || key;
      if (key !== 'updatedAt') {
        supabaseUpdates[dbColumn] = value;
      }
    });

    // Try to update the user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(supabaseUpdates)
      .eq('id', userId)
      .select('*')
      .single();

    if (updateError) {
      return NextResponse.json({
        step: 'update_user',
        error: updateError.message,
        code: updateError.code,
        updates: updates,
      });
    }

    return NextResponse.json({
      success: true,
      existingUser: { id: existingUser.id, email: existingUser.email, name: existingUser.name },
      updatedUser: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name },
      updates: updates,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    });
  }
}