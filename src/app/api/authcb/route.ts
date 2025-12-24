// src/app/api/authcb/route.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('Authcb handler started!', { url: request.url });

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    console.error('No authorization code provided');
    return NextResponse.redirect(
        new URL('/login?error=no_code', requestUrl.origin)
    );
  }

  try {
    const cookieStore = await cookies();  // ← CRITICAL: await here!

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name) {
              return cookieStore.get(name)?.value;
            },
            set(name, value, options) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name, options) {
              cookieStore.set({ name, value: '', ...options });
            },
          },
        }
    );

    console.log('Supabase client created successfully');

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Session exchange failed:', error.message);
      return NextResponse.redirect(
          new URL(`/login?error=auth_failed&msg=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }

    console.log('Session exchanged successfully');

    // Debug: Check session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session after exchange:', session ? 'SET' : 'NOT SET', {
      userId: session?.user?.id,
    });

    return NextResponse.redirect(requestUrl.origin + '/');
  } catch (err: unknown) {
    console.error('Handler error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.redirect(
        new URL(`/login?error=internal&msg=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
    );
  }
}