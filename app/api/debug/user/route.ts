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
      return NextResponse.json({
        error: 'Supabase not configured',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(1);

    return NextResponse.json({
      supabaseConnected: !error,
      error: error?.message,
      sampleUser: data?.[0] || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    });
  }
}