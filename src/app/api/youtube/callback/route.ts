// src/app/api/youtube/callback/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side: use service role key
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
        console.error('No code received in callback');
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'https://squigly.vercel.app'}?error=no_code`
        );
    }

    let parsedState: { userId?: string; channel_id?: string; reconnect?: boolean } = {};
    try {
        parsedState = state ? JSON.parse(state) : {};
    } catch (e) {
        console.error('Invalid state format:', e);
    }

    const userId = parsedState.userId;
    if (!userId) {
        console.error('Missing userId in state');
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'https://squigly.vercel.app'}?error=invalid_state`
        );
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://squigly.vercel.app'}/api/youtube/callback`,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', tokenData);
            throw new Error(tokenData.error_description || 'Token exchange failed');
        }

        const { access_token, refresh_token, expires_in } = tokenData;

        // Fetch channel info
        const channelResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const channelData = await channelResponse.json();

        if (!channelResponse.ok || !channelData.items?.length) {
            console.error('No channel found or API error:', channelData);
            throw new Error('No channel found');
        }

        const channel = channelData.items[0];
        const channelId = channel.id;
        const channelTitle = channel.snippet.title;

        // Save to Supabase (upsert)
        const { error } = await supabaseAdmin
            .from('youtube_tokens')
            .upsert(
                {
                    user_id: userId,
                    channel_id: channelId,
                    channel_title: channelTitle,
                    access_token,
                    refresh_token: refresh_token || null,
                    expires_at: expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null,
                },
                { onConflict: 'user_id,channel_id' }
            );

        if (error) {
            console.error('Supabase upsert error:', error);
            throw error;
        }

        // Success - redirect to dashboard with success param
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'https://squigly.vercel.app'}?channel_added=success`
        );
    } catch (error) {
        console.error('YouTube callback error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'https://squigly.vercel.app'}?error=auth_failed`
        );
    }
}