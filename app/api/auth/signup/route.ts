import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, emailVerificationTokens } from '@/lib/schema';
import { hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Force Node.js runtime for crypto support
export const runtime = 'nodejs';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, metadata = {} } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists using Supabase (to handle RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseKey = serviceRoleKey || supabaseAnonKey;
    
    let existingUser = [];
    
    if (supabaseUrl && supabaseKey) {
      console.log('Checking existing user with Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', normalizedEmail);
      
      if (error) {
        console.error('Supabase query error:', error);
        // Fall back to Drizzle if Supabase fails
        existingUser = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      } else {
        existingUser = data || [];
      }
    } else {
      // Fallback to Drizzle ORM
      existingUser = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    }
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user using Supabase (to handle RLS)
    let newUser = [];
    
    if (supabaseUrl && supabaseKey) {
      console.log('Creating user with Supabase...');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: normalizedEmail,
          password: hashedPassword,
          name: trimmedName,
          location: metadata.location || null,
          carbon_goal: metadata.carbonGoal || 2000,
          subscribe_newsletter: metadata.subscribeNewsletter || false,
          signup_source: metadata.signupSource || 'web',
        })
        .select('*')
        .single();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        newUser = [data];
      }
    } else {
      // Fallback to Drizzle ORM
      newUser = await db.insert(users).values({
        email: normalizedEmail,
        password: hashedPassword,
        name: trimmedName,
        location: metadata.location || null,
        carbonGoal: metadata.carbonGoal || 2000,
        subscribeNewsletter: metadata.subscribeNewsletter || false,
        signupSource: metadata.signupSource || 'web',
      }).returning();
    }

    // Send verification email (optional - don't fail signup if this fails)
    try {
      // Check if Resend is configured
      if (!process.env.RESEND_API_KEY || !resend) {
        console.log('Resend API key not configured - skipping email verification');
      } else {
        console.log('Attempting to send verification email...');
        console.log('Resend API key exists:', !!process.env.RESEND_API_KEY);
        console.log('API key starts with:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
        
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

        // Save verification token using Supabase
        if (supabaseUrl && supabaseKey) {
          console.log('Saving verification token to Supabase...');
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { error: tokenError } = await supabase
            .from('email_verification_tokens')
            .insert({
              user_id: newUser[0].id,
              token,
              expires_at: expiresAt.toISOString(),
              created_at: new Date().toISOString()
            });
          
          if (tokenError) {
            console.error('Error saving token to Supabase:', tokenError);
            // Fall back to Drizzle
            await db.insert(emailVerificationTokens).values({
              userId: newUser[0].id,
              token,
              expiresAt,
            });
          }
        } else {
          // Fallback to Drizzle
          await db.insert(emailVerificationTokens).values({
            userId: newUser[0].id,
            token,
            expiresAt,
          });
        }

        // Send verification email with proper domain
        const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
        
        console.log('Sending email from domain...');
        const emailResult = await resend.emails.send({
        from: 'CarbonCrush <delivered@resend.dev>',
        to: email,
        subject: 'Welcome to CarbonCrush! Please verify your email',
        html: `
          <h2>Welcome to CarbonCrush! 🌱</h2>
          <p>Hi ${name},</p>
          <p>Thank you for joining our mission to fight climate change!</p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px;">Verify Email Address</a>
          <p>This link will expire in 24 hours.</p>
          <p>Welcome to the community! 🌍</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This email was sent from CarbonCrush. If you have any questions, please contact support.</p>
        `,
        });
        
        console.log('Verification email sent successfully');
        console.log('Email result:', emailResult);
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      console.error('Email error details:', (emailError as any)?.message);
      console.error('Email error response:', (emailError as any)?.response?.data);
      // Don't fail signup if email fails, just log it
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 408 }
        );
      }
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}