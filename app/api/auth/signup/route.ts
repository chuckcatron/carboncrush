import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, emailVerificationTokens } from '@/lib/schema';
import { hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Check if user already exists with timeout
    const existingUser = await Promise.race([
      db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ]) as any[];
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with timeout
    const newUser = await Promise.race([
      db.insert(users).values({
        email: normalizedEmail,
        password: hashedPassword,
        name: trimmedName,
        location: metadata.location || null,
        carbonGoal: metadata.carbonGoal || 2000,
        subscribeNewsletter: metadata.subscribeNewsletter || false,
        signupSource: metadata.signupSource || 'web',
      }).returning(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database insert timeout')), 10000)
      )
    ]) as any[];

    // Send verification email
    try {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

      // Save verification token
      await db.insert(emailVerificationTokens).values({
        userId: newUser[0].id,
        token,
        expiresAt,
      });

      // Send verification email
      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
      
      await resend.emails.send({
        from: 'CarbonCrush <onboarding@resend.dev>',
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
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
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