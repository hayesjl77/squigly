import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('Authcb handler running!', { url: request.url });

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  try {
    const cookieStore = await cookies();  // Await here!
    console.log('Cookies loaded successfully, count:', cookieStore.getAll().length);
  } catch (err) {
    console.error('Cookies error:', err);
  }

  return NextResponse.json({
    status: 'Cookies test works',
    codePresent: !!code,
  });
}