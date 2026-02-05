import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with service role key
export function createServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        console.error('NEXT_PUBLIC_SUPABASE_URL is not set');
        throw new Error('Supabase URL is not configured');
    }

    if (!serviceRoleKey) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
        throw new Error('Supabase Service Role Key is not configured');
    }

    return createClient(supabaseUrl, serviceRoleKey);
}
