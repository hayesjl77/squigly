import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('Authcb handler executing!', {
    url: request.url,
    code: request.url.includes('code=') ? 'present' : 'missing',
  });

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ status: 'No code provided - test successful' });
  }

  return NextResponse.redirect(new URL('/', request.url));
}