/*
  # Initial CarbonCrush Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `location` (text, nullable)
      - `carbon_goal` (integer, default 2000)
      - `onboarding_completed` (boolean, default false)
      - `email_verified` (boolean, default false)
      - `subscribe_newsletter` (boolean, default false)
      - `signup_source` (text, default 'web')
      - `avatar_url` (text, nullable)
      - `preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `carbon_calculations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `calculation_data` (jsonb)
      - `results` (jsonb)
      - `created_at` (timestamp)

    - `recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `recommendation_data` (jsonb)
      - `status` (enum: not-started, in-progress, completed)
      - `started_at` (timestamp, nullable)
      - `completed_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE recommendation_status AS ENUM ('not-started', 'in-progress', 'completed');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  location text,
  carbon_goal integer DEFAULT 2000,
  onboarding_completed boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  subscribe_newsletter boolean DEFAULT false,
  signup_source text DEFAULT 'web',
  avatar_url text,
  preferences jsonb DEFAULT '{"notifications": true, "public_profile": false, "share_progress": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create carbon_calculations table
CREATE TABLE IF NOT EXISTS carbon_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  calculation_data jsonb NOT NULL,
  results jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recommendation_data jsonb NOT NULL,
  status recommendation_status DEFAULT 'not-started',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for carbon_calculations
CREATE POLICY "Users can read own calculations"
  ON carbon_calculations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations"
  ON carbon_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations"
  ON carbon_calculations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON carbon_calculations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for recommendations
CREATE POLICY "Users can read own recommendations"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON recommendations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON recommendations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS carbon_calculations_user_id_idx ON carbon_calculations(user_id);
CREATE INDEX IF NOT EXISTS carbon_calculations_created_at_idx ON carbon_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS recommendations_user_id_idx ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS recommendations_status_idx ON recommendations(status);
CREATE INDEX IF NOT EXISTS recommendations_created_at_idx ON recommendations(created_at DESC);