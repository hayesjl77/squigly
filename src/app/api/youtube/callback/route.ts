// src/app/api/youtube/callback/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        const state = JSON.parse(url.searchParams.get('state') || '{}');

        if (!code || !state.userId) {
            return NextResponse.json({ error: 'Missing code or userId' }, { status: 400 });
        }

        // Exchange code for access token
        const clientId = process.env.GOOGLE_CLIENT_ID!;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/youtube/callback`;

        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok) {
            console.error('Token exchange error:', tokenData);
            return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
        }

        // Get channel info
        const channelRes = await fetch('https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const channelData = await channelRes.json();

        if (!channelRes.ok || !channelData.items?.[0]) {
            console.error('Channel fetch error:', channelData);
            return NextResponse.json({ error: 'Failed to get channel info' }, { status: 500 });
        }

        const channel = channelData.items[0];
        const channelId = channel.id;
        const channelTitle = channel.snippet.title;

        // Save or update token in Supabase
        const { error } = await supabaseAdmin
            .from('youtube_tokens')
            .upsert({
                user_id: state.userId,
                channel_id: channelId,
                channel_title: channelTitle,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                scope: tokenData.scope,
                token_type: tokenData.token_type,
                expiry_date: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            }, {
                onConflict: 'user_id, channel_id'  // Update if already exists
            });

        if (error) {
            console.error('Token save error:', error);
            return NextResponse.json({ error: 'Failed to save channel' }, { status: 500 });
        }

        // Redirect back to dashboard
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
    } catch (err) {
        console.error('Callback error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}