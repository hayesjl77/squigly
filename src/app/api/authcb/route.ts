import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('Authcb basic handler running!', {
    url: request.url,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'missing',
  });

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  return NextResponse.json({
    status: 'Basic handler works',
    codePresent: !!code,
  });
}