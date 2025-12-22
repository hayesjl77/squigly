import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { access_token } = await request.json()

        if (!access_token) {
            return NextResponse.json({ items: [] })
        }

        // Get channel uploads
        const channelRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true', {
            headers: { Authorization: `Bearer ${access_token}` },
        })

        if (!channelRes.ok) {
            return NextResponse.json({ items: [] })
        }

        const channelJson = await channelRes.json()
        const uploadsPlaylistId = channelJson.items[0]?.contentDetails?.relatedPlaylists?.uploads

        if (!uploadsPlaylistId) {
            return NextResponse.json({ items: [] })
        }

        // Get recent videos
        const playlistRes = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=30`,
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        )

        if (!playlistRes.ok) {
            return NextResponse.json({ items: [] })
        }

        const playlistJson = await playlistRes.json()

        const videoIds = playlistJson.items
            .map((item: any) => item.snippet.resourceId.videoId)
            .filter(Boolean)
            .join(',')

        if (!videoIds) {
            return NextResponse.json({ items: [] })
        }

        // Get video details + statistics + contentDetails (for duration)
        const videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}`,
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        )

        if (!videosRes.ok) {
            return NextResponse.json({ items: [] })
        }

        const videosJson = await videosRes.json()

        const items = (videosJson.items || []).map((item: any) => {
            const duration = item.contentDetails.duration
            const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/)
            const minutes = parseInt(match?.[1] || '0')
            const seconds = parseInt(match?.[2] || '0')
            const totalSeconds = minutes * 60 + seconds

            return {
                id: item.id,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
                views: Number(item.statistics.viewCount || 0),
                likes: Number(item.statistics.likeCount || 0),
                publishedAt: item.snippet.publishedAt,
                durationSeconds: totalSeconds,
            }
        })

        return NextResponse.json({ items })
    } catch (err) {
        console.error('Shorts route error:', err)
        return NextResponse.json({ items: [] })
    }
}