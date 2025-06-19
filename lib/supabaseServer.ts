import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './supabase'

// Server component helper
export const createSupabaseServerClient = () => createServerComponentClient<Database>({ cookies })