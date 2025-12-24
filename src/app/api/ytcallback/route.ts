// src/app/api/ytcallback/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('YT callback handler running (Step B)', { url: request.url });

    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return NextResponse.json({
            status: 'No code provided - test successful',
            codePresent: false,
        });
    }

    try {
        // Step B: Prepare token exchange
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const tokenBody = new URLSearchParams({
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/ytcallback`,
            grant_type: 'authorization_code',
        });

        console.log('Token exchange params prepared', {
            redirectUriUsed: tokenBody.get('redirect_uri'),
        });

        // Perform the actual fetch to Google
        const tokenRes = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenBody.toString(),
        });

        const tokenData = await tokenRes.json();

        console.log('Token response received', {
            ok: tokenRes.ok,
            status: tokenRes.status,
            hasAccessToken: !!tokenData.access_token,
        });

        return NextResponse.json({
            status: 'Token exchange attempted',
            ok: tokenRes.ok,
            statusCode: tokenRes.status,
            hasAccessToken: !!tokenData.access_token,
            error: tokenData.error || null,
            errorDescription: tokenData.error_description || null,
            // Do NOT return full tokenData in production (sensitive!)
        });
    } catch (err) {
        console.error('Error during token exchange fetch:', err);
        return NextResponse.json({
            status: 'Error in handler',
            message: err instanceof Error ? err.message : 'Unknown error',
        }, { status: 500 });
    }
}