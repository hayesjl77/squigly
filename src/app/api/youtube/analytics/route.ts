// src/app/api/youtube/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { supabaseAdmin } from '@/lib/supabaseAdmin';  // ← Add import

interface AnalyticsResponse {
    totalsForAllResults?: {
        [metric: string]: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { channel_id, access_token, refresh_token } = body as {
            channel_id: string;
            access_token: string;
            refresh_token?: string;
        };

        if (!channel_id || !access_token) {
            return NextResponse.json({ error: 'Missing channel_id or access_token' }, { status: 400 });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ytcallback`  // ← Fixed to ytcallback
        );

        oauth2Client.setCredentials({
            access_token,
            refresh_token: refresh_token || undefined,
        });

        const oldAccessToken = oauth2Client.credentials.access_token;  // ← Track old for comparison

        await oauth2Client.getAccessToken();

        const newAccessToken = oauth2Client.credentials.access_token;

        if (newAccessToken && newAccessToken !== oldAccessToken) {
            const newExpiryDate = oauth2Client.credentials.expiry_date
                ? new Date(oauth2Client.credentials.expiry_date).toISOString()
                : new Date(Date.now() + 3600 * 1000).toISOString();  // Fallback 1hr

            await supabaseAdmin
                .from('youtube_tokens')
                .update({
                    access_token: newAccessToken,
                    expiry_date: newExpiryDate,
                })
                .eq('channel_id', channel_id);

            console.log('Token refreshed and updated in DB:', { channel_id, newExpiryDate });  // ← Debug log
        }

        const analytics = google.youtubeAnalytics('v2');

        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await analytics.reports.query({
            auth: oauth2Client,
            ids: `channel==${channel_id}`,
            startDate,
            endDate,
            metrics: 'views,estimatedMinutesWatched',
        });

        console.log('Analytics query response:', response.data);  // ← Debug log

        // Safe type assertion for response.data
        const data = response.data as AnalyticsResponse;

        const totals = data.totalsForAllResults || {};

        const summary = {
            totalViews: Number(totals.views || 0),
            avgViewDuration: totals.views ? (Number(totals.estimatedMinutesWatched || 0) / Number(totals.views)) * 60 : 0,  // ← Actual avg seconds per view
        };

        return NextResponse.json(summary);
    } catch (error: unknown) {
        console.error('YouTube Analytics v2 error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}