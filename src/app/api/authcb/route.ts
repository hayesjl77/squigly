import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('Authcb handler started!', { url: request.url });

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    console.error('No code provided');
    return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
  }

  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            },
          },
        }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Session exchange failed:', error.message);
      return NextResponse.redirect(new URL(`/login?error=auth_failed&msg=${encodeURIComponent(error.message)}`, requestUrl.origin));
    }

    console.log('Session exchanged successfully');
    return NextResponse.redirect(requestUrl.origin + '/');  // Redirect to dashboard/home
  } catch (err) {
    console.error('Handler error:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.redirect(new URL(`/login?error=internal&msg=${encodeURIComponent(errorMsg)}`, requestUrl.origin));
  }
}