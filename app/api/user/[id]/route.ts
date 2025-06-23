import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
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

  // Fallback to NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user.id === userId) {
      return session.user;
    }
  } catch (error) {
    console.log('NextAuth session failed:', error);
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET /api/user/[id] - User ID:', params.id);
    
    const authenticatedUser = await getAuthenticatedUser(request, params.id);
    if (!authenticatedUser) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try Supabase first (for Bolt environment)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (!error && user) {
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
      }
    }

    // Fallback to Drizzle ORM
    const user = await db.select().from(users).where(eq(users.id, params.id)).limit(1);
    
    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user[0];
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PATCH /api/user/[id] - User ID:', params.id);
    
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

    // Try Supabase first (for Bolt environment)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ ...safeUpdates, updatedAt: new Date().toISOString() })
        .eq('id', params.id)
        .select('*')
        .single();
      
      if (!error && updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser;
        console.log('User updated successfully via Supabase');
        return NextResponse.json(userWithoutPassword);
      } else {
        console.error('Supabase update error:', error);
      }
    }

    // Fallback to Drizzle ORM
    const userFields = ['name', 'email', 'location', 'carbonGoal', 'onboardingCompleted', 'emailVerified', 'subscribeNewsletter', 'signupSource', 'avatarUrl'];
    const directUpdates: any = {};
    const preferenceUpdates: any = {};
    
    Object.entries(safeUpdates).forEach(([key, value]) => {
      if (userFields.includes(key) && value !== undefined && value !== null) {
        directUpdates[key] = value;
      } else if (value !== undefined && value !== null) {
        // Store other fields in preferences
        preferenceUpdates[key] = value;
      }
    });
    
    // If we have preference updates, we need to merge with existing preferences
    if (Object.keys(preferenceUpdates).length > 0) {
      // First get current preferences
      const currentUser = await db.select({ preferences: users.preferences }).from(users).where(eq(users.id, params.id)).limit(1);
      const currentPreferences = currentUser[0]?.preferences || {};
      
      directUpdates.preferences = {
        ...currentPreferences,
        ...preferenceUpdates
      };
    }
    
    console.log('Direct updates to apply:', directUpdates);
    
    const updatedUser = await db
      .update(users)
      .set({ ...directUpdates, updatedAt: new Date() })
      .where(eq(users.id, params.id))
      .returning();

    if (!updatedUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser[0];
    
    console.log('User updated successfully via Drizzle');
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}