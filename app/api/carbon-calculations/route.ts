import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Force Node.js runtime for JWT and crypto support
export const runtime = 'nodejs';

async function getAuthenticatedUser(request: NextRequest) {
  // Try custom auth token first (for Bolt environment)
  const token = request.cookies.get('auth-token')?.value;
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || 'J7DpgaKNQdWQdvf7hrI0imHDDk/HjBBG/snmulQzeUM='
      ) as any;
      
      return decoded;
    } catch (error) {
      console.log('Custom token verification failed:', error);
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CARBON CALCULATION SAVE API CALLED ===');
    const { carbonData, results } = await request.json();

    if (!carbonData || !results) {
      return NextResponse.json(
        { error: 'Missing carbon data or results' },
        { status: 400 }
      );
    }

    const authenticatedUser = await getAuthenticatedUser(request);
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseKey = serviceRoleKey || supabaseAnonKey;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database service not configured' },
        { status: 500 }
      );
    }

    console.log('Saving carbon calculation to database...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save the carbon calculation using your exact schema
    const { data, error } = await supabase
      .from('carbon_calculations')
      .insert({
        user_id: authenticatedUser.id,
        calculation_data: carbonData,
        results: results,
        created_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error saving carbon calculation:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Carbon calculation saved successfully');
    return NextResponse.json({ 
      success: true, 
      calculation: data 
    });

  } catch (error) {
    console.error('Error in carbon calculation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request);
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseKey = serviceRoleKey || supabaseAnonKey;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database service not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's carbon calculations
    const { data: calculations, error } = await supabase
      .from('carbon_calculations')
      .select('*')
      .eq('user_id', authenticatedUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching carbon calculations:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ calculations: calculations || [] });

  } catch (error) {
    console.error('Error fetching carbon calculations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}