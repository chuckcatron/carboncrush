import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, emailVerificationTokens } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Force Node.js runtime for crypto and JWT support
export const runtime = 'nodejs';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

  // Fallback to NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return session.user;
    }
  } catch (error) {
    console.log('NextAuth session failed:', error);
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request);
    
    if (!authenticatedUser?.id) {
      console.log('No authenticated user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('Authenticated user for verification:', authenticatedUser.id);

    // Get user details using Supabase (to handle RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseKey = serviceRoleKey || supabaseAnonKey;
    
    let user = null;
    
    if (supabaseUrl && supabaseKey) {
      console.log('Looking up user with Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authenticatedUser.id)
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
      } else {
        user = data;
      }
    }
    
    // Fallback to Drizzle
    if (!user) {
      console.log('Fallback to Drizzle ORM...');
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, authenticatedUser.id))
        .limit(1);
      user = dbUser;
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Save token to database using Supabase
    if (supabaseUrl && supabaseKey) {
      console.log('Saving verification token to Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: tokenError } = await supabase
        .from('email_verification_tokens')
        .insert({
          user_id: user.id,
          token,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        });
      
      if (tokenError) {
        console.error('Error saving token to Supabase:', tokenError);
        // Fall back to Drizzle
        try {
          await db.insert(emailVerificationTokens).values({
            userId: user.id,
            token,
            expiresAt,
          });
        } catch (drizzleError) {
          console.error('Drizzle fallback also failed:', drizzleError);
          return NextResponse.json(
            { error: 'Failed to save verification token' },
            { status: 500 }
          );
        }
      }
    } else {
      // Fallback to Drizzle
      await db.insert(emailVerificationTokens).values({
        userId: user.id,
        token,
        expiresAt,
      });
    }

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    
    if (!resend || !process.env.RESEND_API_KEY) {
      console.error('Resend not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    
    try {
      console.log('Sending verification email to:', user.email);
      const emailResult = await resend.emails.send({
        from: 'CarbonCrush <delivered@resend.dev>',
        to: user.email,
        subject: 'Verify your email address',
        html: `
          <h2>Welcome to CarbonCrush! 🌱</h2>
          <p>Thank you for joining our mission to fight climate change.</p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px;">Verify Email Address</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account with CarbonCrush, please ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This email was sent from CarbonCrush. If you have any questions, please contact support.</p>
        `,
      });
      
      console.log('Verification email sent successfully');
      console.log('Email result:', emailResult);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      console.error('Email error details:', (emailError as any)?.message);
      console.error('Email error response:', (emailError as any)?.response?.data);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}