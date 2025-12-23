// src/lib/supabaseAdmin.ts  (or lib/supabaseAdmin.ts)
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // ← must use service role key, not anon
    { auth: { autoRefreshToken: false, persistSession: false } }
);