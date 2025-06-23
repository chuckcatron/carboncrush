import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the first user to see the actual schema
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: error.message,
        code: error.code,
      });
    }

    const sampleUser = users?.[0];
    const availableColumns = sampleUser ? Object.keys(sampleUser) : [];

    return NextResponse.json({
      availableColumns,
      sampleUser: sampleUser ? {
        id: sampleUser.id,
        email: sampleUser.email,
        // Show all columns and their types
        ...Object.fromEntries(
          Object.entries(sampleUser).map(([key, value]) => [
            key, 
            { value, type: typeof value }
          ])
        )
      } : null,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    });
  }
}