// src/app/api/ytcallback/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('YT callback handler started', { url: request.url });

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const stateParam = url.searchParams.get('state');

    if (!code) {
        console.error('Missing authorization code');
        return NextResponse.redirect(new URL('/?error=missing_code', url.origin));
    }

    if (!stateParam) {
        console.error('Missing state parameter');
        return NextResponse.redirect(new URL('/?error=missing_state', url.origin));
    }

    let state;
    try {
        state = JSON.parse(stateParam);
        console.log('State parsed', { state });
    } catch (e) {
        console.error('Invalid state JSON:', e);
        return NextResponse.redirect(new URL('/?error=invalid_state', url.origin));
    }

    if (!state.userId) {
        console.error('No userId in state');
        return NextResponse.redirect(new URL('/?error=no_user_id', url.origin));
    }

    try {
        // Token exchange
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

        if (!tokenRes.ok) {
            console.error('Token exchange failed', tokenData);
            const errorMsg = tokenData.error_description || tokenData.error || 'Unknown token error';
            return NextResponse.redirect(
                new URL(`/?error=token_exchange&msg=${encodeURIComponent(errorMsg)}`, url.origin)
            );
        }

        // Channel fetch
        const channelRes = await fetch(
            'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true',
            {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            }
        );

        const channelData = await channelRes.json();

        if (!channelRes.ok || !channelData.items?.[0]) {
            console.error('Channel fetch failed', channelData);
            return NextResponse.redirect(new URL('/?error=channel_fetch', url.origin));
        }

        const channel = channelData.items[0];
        const channelId = channel.id;
        const channelTitle = channel.snippet.title;

        // Save to Supabase
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
            console.error('Supabase upsert error', upsertError);
            return NextResponse.redirect(new URL('/?error=save_channel', url.origin));
        }

        console.log('YT callback completed successfully');
        return NextResponse.redirect(url.origin + '/');
    } catch (err) {
        console.error('Callback global error', err);
        return NextResponse.redirect(new URL('/?error=internal_error', url.origin));
    }
}