// src/app/api/youtube/callback/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    console.log('Callback hit!', { code, state });

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=no_code`);
    }

    // Hardcode success redirect for test
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?success=test_callback`);
}