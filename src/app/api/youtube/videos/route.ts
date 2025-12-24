// src/app/api/youtube/videos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

async function getValidAccessToken(channelId: string) {
    const { data: tokenData } = await supabaseAdmin
        .from('youtube_tokens')
        .select('access_token, refresh_token, expiry_date')  // ← Changed to expiry_date
        .eq('channel_id', channelId)
        .single()

    if (!tokenData) throw new Error('No token found')

    const expiryDate = tokenData.expiry_date ? new Date(tokenData.expiry_date) : null
    const isExpired = !expiryDate || expiryDate < new Date()

    console.log('Token check:', { channelId, isExpired, expiryDate });  // ← Debug log

    if (!isExpired) {
        return tokenData.access_token
    }

    // Refresh the token
    if (!tokenData.refresh_token) throw new Error('No refresh token')

    const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            refresh_token: tokenData.refresh_token,
            grant_type: 'refresh_token',
        }),
    })

    const refreshData = await refreshRes.json()
    if (!refreshRes.ok) throw new Error('Failed to refresh token: ' + JSON.stringify(refreshData))  // ← Better error

    const newAccessToken = refreshData.access_token
    const newExpiryDate = new Date(Date.now() + (refreshData.expires_in || 3600) * 1000)

    // Save refreshed token
    await supabaseAdmin
        .from('youtube_tokens')
        .update({
            access_token: newAccessToken,
            expiry_date: newExpiryDate.toISOString(),  // ← Changed to expiry_date
        })
        .eq('channel_id', channelId)

    console.log('Token refreshed and updated:', { channelId, newExpiryDate });  // ← Debug log

    return newAccessToken
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { channel_id } = body

    if (!channel_id) {
        return NextResponse.json({ error: 'Missing channel_id' }, { status: 400 })
    }

    try {
        const access_token = await getValidAccessToken(channel_id)

        // Get uploads playlist
        const channelRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true', {
            headers: { Authorization: `Bearer ${access_token}` },
        })
        const channelData = await channelRes.json()
        if (!channelRes.ok || !channelData.items?.[0]) {
            throw new Error('Failed to fetch channel info: ' + JSON.stringify(channelData))
        }
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads

        // Fetch all videos (same as before)
        let videoIds: string[] = []
        let nextPageToken = ''
        do {
            const playlistRes = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}`,
                { headers: { Authorization: `Bearer ${access_token}` } }
            )
            const playlistData = await playlistRes.json()
            if (!playlistRes.ok) throw new Error('Failed to fetch playlist: ' + JSON.stringify(playlistData))

            videoIds = videoIds.concat(playlistData.items.map((item: any) => item.snippet.resourceId.videoId))
            nextPageToken = playlistData.nextPageToken || ''
        } while (nextPageToken)

        console.log('Fetched video IDs:', { count: videoIds.length });  // ← Debug log

        // Batch video details
        const videos = []
        for (let i = 0; i < videoIds.length; i += 50) {
            const batchIds = videoIds.slice(i, i + 50).join(',')
            const videosRes = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${batchIds}`,
                { headers: { Authorization: `Bearer ${access_token}` } }
            )
            const videosData = await videosRes.json()
            if (!videosRes.ok) throw new Error('Failed to fetch video details: ' + JSON.stringify(videosData))

            videos.push(...videosData.items)
        }

        const formattedVideos = videos.map((video: any) => ({
            id: video.id,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
            views: Number(video.statistics.viewCount || 0),
            likes: Number(video.statistics.likeCount || 0),
            comments: Number(video.statistics.commentCount || 0),
            duration: video.contentDetails.duration,
        }))

        console.log('Formatted videos:', { count: formattedVideos.length });  // ← Debug log

        return NextResponse.json({ items: formattedVideos })
    } catch (error: any) {
        console.error('YouTube videos fetch error:', error)
        return NextResponse.json({ error: error.message || 'Failed to fetch videos' }, { status: 500 })
    }
}