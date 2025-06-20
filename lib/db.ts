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

// Create postgres connection for Drizzle
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

// Test connection
export async function testConnection() {
  try {
    const result = await client`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}