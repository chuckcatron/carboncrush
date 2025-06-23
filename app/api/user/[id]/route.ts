import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET /api/user/[id] - User ID:', params.id);
    
    let session;
    try {
      session = await getServerSession(authOptions);
      console.log('Session obtained:', !!session);
    } catch (sessionError) {
      console.error('Error getting session:', sessionError);
      return NextResponse.json({ error: 'Session error' }, { status: 500 });
    }
    
    if (!session || session.user.id !== params.id) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    console.log('Update data received:', updates);
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, id, createdAt, ...updateData } = updates;
    
    // Separate direct user fields from preference fields
    const userFields = ['name', 'email', 'location', 'carbonGoal', 'onboardingCompleted', 'emailVerified', 'subscribeNewsletter', 'signupSource', 'avatarUrl'];
    const directUpdates: any = {};
    const preferenceUpdates: any = {};
    
    Object.entries(updateData).forEach(([key, value]) => {
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
    
    if (Object.keys(directUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }
    
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
    
    console.log('User updated successfully');
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}