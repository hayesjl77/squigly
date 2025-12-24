import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic'; // No caching

export async function GET(request: Request) {
    try {
        console.log('YouTube callback route started', { url: request.url });

        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        const stateParam = url.searchParams.get('state');

        console.log('Params extracted', { code: !!code, stateParam });

        if (!code) {
            console.error('Missing authorization code');
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=missing_code`);
        }

        if (!stateParam) {
            console.error('Missing state parameter');
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=missing_state`);
        }

        let state;
        try {
            state = JSON.parse(stateParam);
            console.log('State parsed', { state });
        } catch (e) {
            console.error('Invalid state JSON:', e);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=invalid_state`);
        }

        if (!state.userId) {
            console.error('No userId in state');
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=no_user_id`);
        }

        // Token exchange
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const tokenBody = new URLSearchParams({
            code,
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/youtube-callback`,  // ← IMPORTANT: Update to your FINAL flattened path
            grant_type: 'authorization_code',
        });

        console.log('Token exchange starting');
        const tokenRes = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenBody.toString(),
        });

        const tokenData = await tokenRes.json();
        console.log('Token response', { ok: tokenRes.ok, status: tokenRes.status });

        if (!tokenRes.ok) {
            console.error('Token exchange failed', tokenData);
            const errorMsg = tokenData.error_description || tokenData.error || 'Unknown token error';
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/?error=token_exchange&msg=${encodeURIComponent(errorMsg)}`
            );
        }

        // Channel fetch
        console.log('Channel fetch starting');
        const channelRes = await fetch(
            'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true',
            {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            }
        );

        const channelData = await channelRes.json();
        console.log('Channel response', { ok: channelRes.ok, status: channelRes.status });

        if (!channelRes.ok || !channelData.items?.[0]) {
            console.error('Channel fetch failed', channelData);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=channel_fetch`);
        }

        const channel = channelData.items[0];
        const channelId = channel.id;
        const channelTitle = channel.snippet.title;

        // Save to Supabase
        console.log('Supabase upsert starting');
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
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=save_channel`);
        }

        console.log('YouTube callback completed successfully');
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);

    } catch (err) {
        console.error('Callback global error', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=internal_error`);
    }
}