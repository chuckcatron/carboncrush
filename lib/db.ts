import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Debug environment variable loading
console.log('DB Connection - DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Available env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE')));
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres connection for Drizzle with better error handling for Bolt environment
const connectionString = process.env.DATABASE_URL;

// Configure postgres client with settings optimized for Bolt environment
const client = postgres(connectionString, { 
  prepare: false,
  max: 1, // Limit connections in Bolt environment
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

export const db = drizzle(client, { schema });

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized');
} else {
  console.log('Supabase not configured - using direct PostgreSQL connection');
}

// Test connection with better error handling
export async function testConnection() {
  try {
    const result = await Promise.race([
      client`SELECT 1 as test`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      )
    ]);
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Test Supabase connection
export async function testSupabaseConnection() {
  if (!supabase) {
    console.log('Supabase not configured');
    return false;
  }
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}