// src/app/api/ytcallback/route.ts (temporary dummy test)
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('YT callback dummy test started', { url: request.url });

    // Dummy state for testing (replace with real in production)
    const state = { userId: 'test-user-id' };  // Use a real user ID from Supabase for testing

    // Dummy tokenData (simulate successful token exchange)
    const tokenData = {
        access_token: 'dummy-access-token',
        refresh_token: 'dummy-refresh-token',
        scope: 'dummy-scope',
        token_type: 'Bearer',
        expires_in: 3600,  // 1 hour
    };

    // Dummy channel data (simulate successful channel fetch)
    const channelId = 'dummy-channel-id';
    const channelTitle = 'Dummy Channel Title';

    try {
        console.log('Dummy Supabase upsert starting');
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
            console.error('Dummy upsert error', upsertError);
            return NextResponse.json({ error: 'Dummy save failed', details: upsertError });
        }

        console.log('Dummy upsert success', {
            userId: state.userId,
            channelId,
            expiryDate: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        });

        return NextResponse.json({ status: 'Dummy test success - check Supabase table for new row' });
    } catch (err) {
        console.error('Dummy handler error', err);
        return NextResponse.json({ error: 'Dummy handler failed', details: err });
    }
}