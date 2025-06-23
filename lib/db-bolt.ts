import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if we're in Bolt environment
const isBolt = typeof process !== 'undefined' && process.env.BOLT_ENVIRONMENT === 'true';

// Create a wrapper for postgres connection that handles Bolt environment issues
function createPostgresClient(connectionString: string) {
  if (isBolt) {
    // In Bolt, use minimal configuration to avoid ArrayBuffer issues
    return postgres(connectionString, {
      prepare: false,
      max: 1,
      idle_timeout: 0,
      connect_timeout: 5,
      ssl: false,
      connection: {
        application_name: 'carboncrush-bolt'
      }
    });
  }
  
  // Normal configuration for non-Bolt environments
  return postgres(connectionString, { 
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false
  });
}

// Use Supabase client as primary in Bolt environment
export function getDb() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (isBolt && supabaseUrl && supabaseAnonKey) {
    console.log('Using Supabase client in Bolt environment');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Return a proxy that uses Supabase for queries
    return new Proxy({}, {
      get(target, prop) {
        if (prop === 'select') {
          return () => ({
            from: (table: string) => ({
              where: (condition: any) => ({
                limit: (num: number) => supabase.from(table).select('*').limit(num)
              })
            })
          });
        }
        return target[prop as keyof typeof target];
      }
    });
  }
  
  // Fallback to postgres connection
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  const client = createPostgresClient(connectionString);
  return drizzle(client, { schema });
}

export const db = getDb();