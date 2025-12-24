// src/app/api/ytcallback/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('YT callback started - full debug version');

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const stateParam = url.searchParams.get('state');

    if (!code) {
        console.log('No code - early exit');
        return NextResponse.json({ status: 'No code', debug: 'Test successful' });
    }

    let state;
    try {
        state = JSON.parse(stateParam || '{}');
        console.log('State parsed', state);
    } catch (e) {
        console.error('State parse failed', e);
        return NextResponse.json({ error: 'Invalid state' });
    }

    if (!state.userId) {
        console.error('No userId in state');
        return NextResponse.json({ error: 'No userId' });
    }

    try {
        console.log('Step 1: Token exchange starting');
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const tokenBody = new URLSearchParams({
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/ytcallback`,
            grant_type: 'authorization_code',
        });

        const tokenRes = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenBody.toString(),
        });

        const tokenData = await tokenRes.json();
        console.log('Token exchange result', { ok: tokenRes.ok, status: tokenRes.status });

        if (!tokenRes.ok) {
            return NextResponse.json({ error: 'Token exchange failed', details: tokenData });
        }

        console.log('Step 2: Channel fetch starting');
        const channelRes = await fetch(
            'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true',
            {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            }
        );

        const channelData = await channelRes.json();
        console.log('Channel fetch result', { ok: channelRes.ok });

        if (!channelRes.ok || !channelData.items?.[0]) {
            return NextResponse.json({ error: 'Channel fetch failed', details: channelData });
        }

        const channel = channelData.items[0];
        const channelId = channel.id;
        const channelTitle = channel.snippet.title;

        console.log('Step 3: Supabase upsert starting');
        const { error: upsertError } = await supabaseAdmin
            .from('youtube_tokens')
            .upsert(
                {
                    user_id: state.userId,
                    channel_id: channelId,
                    channel_title: channelTitle,
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token || null,
                    scope: tokenData.scope,
                    token_type: tokenData.token_type,
                    expiry_date: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
                },
                { onConflict: 'user_id, channel_id' }
            );

        if (upsertError) {
            console.error('Upsert failed', upsertError);
            return NextResponse.json({ error: 'Upsert failed', details: upsertError });
        }

        console.log('Full callback success');
        return NextResponse.json({ status: 'Full success - test mode' });
    } catch (err) {
        console.error('Full handler error', err);
        return NextResponse.json({ error: 'Handler crashed', details: err });
    }
}