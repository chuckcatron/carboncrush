import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Force Node.js runtime for JWT and crypto support
export const runtime = "nodejs";

async function getAuthenticatedUser(request: NextRequest, userId: string) {
  // Try custom auth token first (for Bolt environment)
  const token = request.cookies.get("auth-token")?.value;
  const secret = process.env.NEXTAUTH_SECRET;
  if (token && secret) {
    try {
      const decoded = jwt.verify(token, secret) as any;

      if (decoded.id === userId) {
        return decoded;
      }
    } catch (error) {
      console.log("Custom token verification failed:", error);
    }
  }

  // Fallback to NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user.id === userId) {
      return session.user;
    }
  } catch (error) {
    console.log("NextAuth session failed:", error);
  }

  return null;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET /api/user/[id] - User ID:", params.id);

    const authenticatedUser = await getAuthenticatedUser(request, params.id);
    if (!authenticatedUser) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try Supabase first (for Bolt environment)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseKey = serviceRoleKey || supabaseAnonKey;

    if (supabaseUrl && supabaseKey) {
      console.log("Using Supabase with service role key:", !!serviceRoleKey);
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: user, error } = await supabase.from("users").select("*").eq("id", params.id).single();

      if (error) {
        console.error("Supabase error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
      }

      if (!error && user) {
        // Convert snake_case to camelCase for response
        const camelCaseUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          location: user.location,
          carbonGoal: user.carbon_goal,
          onboardingCompleted: user.onboarding_completed,
          emailVerified: user.email_verified,
          subscribeNewsletter: user.subscribe_newsletter,
          signupSource: user.signup_source,
          avatarUrl: user.avatar_url,
          preferences: user.preferences,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          // Also include snake_case versions for compatibility
          onboarding_completed: user.onboarding_completed,
          email_verified: user.email_verified,
          carbon_goal: user.carbon_goal,
          subscribe_newsletter: user.subscribe_newsletter,
          signup_source: user.signup_source,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at,
        };

        console.log("User fetched from Supabase - onboarding_completed:", user.onboarding_completed);
        return NextResponse.json(camelCaseUser);
      }
    }

    // Fallback to Drizzle ORM
    const user = await db.select().from(users).where(eq(users.id, params.id)).limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user[0];

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Also export as POST for Bolt environment which doesn't support PATCH
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return PATCH(request, { params });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PATCH /api/user/[id] - User ID:", params.id);

    const authenticatedUser = await getAuthenticatedUser(request, params.id);
    if (!authenticatedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    console.log("Update data received:", updates);

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, id, createdAt, ...safeUpdates } = updates;

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
    }

    // Try Supabase first (for Bolt environment)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      // Map camelCase to snake_case for Supabase
      const columnMapping: Record<string, string> = {
        onboardingCompleted: "onboarding_completed",
        emailVerified: "email_verified",
        subscribeNewsletter: "subscribe_newsletter",
        signupSource: "signup_source",
        avatarUrl: "avatar_url",
        carbonGoal: "carbon_goal",
        createdAt: "created_at",
        updatedAt: "updated_at",
      };

      const supabaseUpdates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      // Convert camelCase to snake_case
      Object.entries(safeUpdates).forEach(([key, value]) => {
        const dbColumn = columnMapping[key] || key;
        // Don't add updatedAt since we're already setting updated_at above
        if (key !== "updatedAt") {
          supabaseUpdates[dbColumn] = value;
        }
      });

      console.log("Supabase updates:", supabaseUpdates);

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: updatedUser, error } = await supabase.from("users").update(supabaseUpdates).eq("id", params.id).select("*").single();

      if (!error && updatedUser) {
        // Convert snake_case back to camelCase for response
        const camelCaseUser = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          location: updatedUser.location,
          carbonGoal: updatedUser.carbon_goal,
          onboardingCompleted: updatedUser.onboarding_completed,
          emailVerified: updatedUser.email_verified,
          subscribeNewsletter: updatedUser.subscribe_newsletter,
          signupSource: updatedUser.signup_source,
          avatarUrl: updatedUser.avatar_url,
          preferences: updatedUser.preferences,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at,
          // Also include snake_case versions for compatibility
          onboarding_completed: updatedUser.onboarding_completed,
          email_verified: updatedUser.email_verified,
          carbon_goal: updatedUser.carbon_goal,
          subscribe_newsletter: updatedUser.subscribe_newsletter,
          signup_source: updatedUser.signup_source,
          avatar_url: updatedUser.avatar_url,
          created_at: updatedUser.created_at,
          updated_at: updatedUser.updated_at,
        };

        console.log("User updated successfully via Supabase - onboarding_completed:", updatedUser.onboarding_completed);
        return NextResponse.json(camelCaseUser);
      } else {
        console.error("Supabase update error:", error);
      }
    }

    // Fallback to Drizzle ORM
    const userFields = ["name", "email", "location", "carbonGoal", "onboardingCompleted", "emailVerified", "subscribeNewsletter", "signupSource", "avatarUrl"];
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
        ...preferenceUpdates,
      };
    }

    console.log("Direct updates to apply:", directUpdates);

    const updatedUser = await db
      .update(users)
      .set({ ...directUpdates, updatedAt: new Date() })
      .where(eq(users.id, params.id))
      .returning();

    if (!updatedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser[0];

    console.log("User updated successfully via Drizzle");
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
