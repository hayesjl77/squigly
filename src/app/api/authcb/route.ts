import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('Authcb handler running!', { url: request.url });

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  try {
    const cookieStore = await cookies();
    console.log('Cookies loaded, count:', cookieStore.getAll().length);

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            },
          },
        }
    );

    console.log('Supabase client created successfully');

    return NextResponse.json({
      status: 'Supabase client test works',
      codePresent: !!code,
    });
  } catch (err) {
    console.error('Error in handler:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Handler failed', details: errorMessage }, { status: 500 });
  }
}