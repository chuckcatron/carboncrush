import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, emailVerificationTokens } from '@/lib/schema';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    console.log('Looking up verification token:', token);
    
    // Try Supabase first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseKey = serviceRoleKey || supabaseAnonKey;
    
    let verificationToken = null;
    
    if (supabaseUrl && supabaseKey) {
      console.log('Looking up token in Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('email_verification_tokens')
        .select('*')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error) {
        console.error('Supabase token lookup error:', error);
      } else {
        verificationToken = data;
        console.log('Found token in Supabase:', !!verificationToken);
      }
    }
    
    // Fallback to Drizzle if not found in Supabase
    if (!verificationToken) {
      console.log('Fallback to Drizzle token lookup...');
      const [drizzleToken] = await db
        .select()
        .from(emailVerificationTokens)
        .where(
          and(
            eq(emailVerificationTokens.token, token),
            gt(emailVerificationTokens.expiresAt, new Date()),
            isNull(emailVerificationTokens.usedAt)
          )
        )
        .limit(1);
      verificationToken = drizzleToken;
    }

    if (!verificationToken) {
      console.log('No valid token found');
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }
    
    console.log('Found valid token for user:', verificationToken.user_id || verificationToken.userId);

    const userId = verificationToken.user_id || verificationToken.userId;
    const tokenId = verificationToken.id;
    
    // Update user email verification status using Supabase
    if (supabaseUrl && supabaseKey) {
      console.log('Updating user verification status in Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Update user
      const { error: userError } = await supabase
        .from('users')
        .update({ email_verified: true })
        .eq('id', userId);
      
      if (userError) {
        console.error('Error updating user in Supabase:', userError);
      }
      
      // Mark token as used (delete it since used_at column might not exist)
      const { error: tokenError } = await supabase
        .from('email_verification_tokens')
        .delete()
        .eq('id', tokenId);
      
      if (tokenError) {
        console.error('Error deleting token in Supabase:', tokenError);
      } else {
        console.log('Token deleted successfully');
      }
    } else {
      // Fallback to Drizzle
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, userId));

      // Mark token as used
      await db
        .update(emailVerificationTokens)
        .set({ usedAt: new Date() })
        .where(eq(emailVerificationTokens.id, tokenId));
    }

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}