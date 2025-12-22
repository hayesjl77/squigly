// app/api/youtube/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { channel_id, access_token, refresh_token } = body;

        if (!channel_id || !access_token) {
            return NextResponse.json({ error: 'Missing channel_id or access_token' }, { status: 400 });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/youtube/callback`
        );

        oauth2Client.setCredentials({
            access_token,
            refresh_token: refresh_token || undefined,
        });

        try {
            await oauth2Client.getAccessToken();
        } catch (e) {
            console.warn('Token refresh warning:', e);
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

        const totals = response.data.totalsForAllResults || {};

        const summary = {
            totalViews: Number(totals.views || 0),
            avgViewDuration: Number(totals.estimatedMinutesWatched || 0) * 60, // minutes to seconds
        };

        return NextResponse.json(summary);
    } catch (error: any) {
        console.error('YouTube Analytics v2 error:', {
            message: error.message,
            response: error.response?.data,
            details: error.errors,
        });
        return NextResponse.json(
            { error: error.message || 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}