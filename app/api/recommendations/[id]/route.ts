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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recommendationId = params.id;
    const { status, userId } = await request.json();

    console.log('PATCH /api/recommendations/[id] - Recommendation ID:', recommendationId);
    console.log('Status update:', status, 'User ID:', userId);

    const authenticatedUser = await getAuthenticatedUser(request);
    if (!authenticatedUser || authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['not-started', 'in-progress', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseKey = serviceRoleKey || supabaseAnonKey;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare update data
    const updateData: any = {
      status
    };

    // Set timestamps based on status
    if (status === 'in-progress') {
      updateData.started_at = new Date().toISOString();
      updateData.completed_at = null; // Clear completed date if going back to in-progress
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
      // Keep started_at if it exists
    } else if (status === 'not-started') {
      updateData.started_at = null;
      updateData.completed_at = null;
    }

    // Update the recommendation
    const { data: updatedRecommendation, error } = await supabase
      .from('recommendations')
      .update(updateData)
      .eq('id', recommendationId)
      .eq('user_id', userId) // Ensure user can only update their own recommendations
      .select('*')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updatedRecommendation) {
      return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
    }

    console.log('Recommendation updated successfully');
    return NextResponse.json({
      success: true,
      recommendation: updatedRecommendation
    });

  } catch (error) {
    console.error('Error updating recommendation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Also support POST for environments that don't support PATCH
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PATCH(request, { params });
}