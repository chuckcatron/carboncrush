-- Initial schema for CarbonCrush
-- Create custom types
CREATE TYPE "public"."recommendation_status" AS ENUM('not-started', 'in-progress', 'completed');

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"location" text,
	"carbon_goal" integer DEFAULT 2000,
	"onboarding_completed" boolean DEFAULT false,
	"email_verified" boolean DEFAULT false,
	"subscribe_newsletter" boolean DEFAULT false,
	"signup_source" text DEFAULT 'web',
	"avatar_url" text,
	"preferences" jsonb DEFAULT '{"notifications":true,"publicProfile":false,"shareProgress":false}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Create carbon_calculations table
CREATE TABLE IF NOT EXISTS "carbon_calculations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"calculation_data" jsonb NOT NULL,
	"results" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS "recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recommendation_data" jsonb NOT NULL,
	"status" "recommendation_status" DEFAULT 'not-started',
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "carbon_calculations" ADD CONSTRAINT "carbon_calculations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "carbon_calculations_user_id_idx" ON "carbon_calculations"("user_id");
CREATE INDEX IF NOT EXISTS "carbon_calculations_created_at_idx" ON "carbon_calculations"("created_at");
CREATE INDEX IF NOT EXISTS "recommendations_user_id_idx" ON "recommendations"("user_id");
CREATE INDEX IF NOT EXISTS "recommendations_status_idx" ON "recommendations"("status");
CREATE INDEX IF NOT EXISTS "recommendations_created_at_idx" ON "recommendations"("created_at");

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users updated_at
DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();