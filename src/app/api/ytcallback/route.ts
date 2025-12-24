import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('YT callback minimal test hit!', { url: request.url });

    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    return NextResponse.json({
        status: 'YT callback test works',
        codePresent: !!code,
    });
}