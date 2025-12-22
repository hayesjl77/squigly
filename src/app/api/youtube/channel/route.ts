import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { access_token } = await request.json()

        const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,status&mine=true', {
            headers: { Authorization: `Bearer ${access_token}` },
        })

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch channel settings' })
        }

        const data = await res.json()
        const channel = data.items[0]

        return NextResponse.json({
            title: channel.snippet.title,
            description: channel.snippet.description || "(no description)",
            bannerUrl: channel.brandingSettings?.image?.bannerExternalUrl || null,
            madeForKids: channel.status.madeForKids || false,
            isForKids: channel.status.isForKids || false,
        })
    } catch (err) {
        return NextResponse.json({ error: 'Error' })
    }
}