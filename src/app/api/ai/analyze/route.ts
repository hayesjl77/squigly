import { NextRequest, NextResponse } from 'next/server';

// xAI Grok API endpoint and key
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_API_KEY = process.env.XAI_API_KEY!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { videos, channel_name, channel_about, goal } = body;

        if (!videos || !Array.isArray(videos) || videos.length === 0) {
            return NextResponse.json({ error: 'No videos provided' }, { status: 400 });
        }

        if (!GROK_API_KEY) {
            console.error('Missing XAI_API_KEY in environment variables');
            return NextResponse.json({ error: 'Server configuration error: Missing API key' }, { status: 500 });
        }

        // Prepare video summary (limit to recent 10 to avoid token overflow)
        const videoSummary = videos
            .slice(0, 10)
            .map((v: any) => ({
                title: v.title,
                views: v.views,
                likes: v.likes,
                comments: v.comments,
                duration: v.duration,
                publishedAt: v.publishedAt,
                isShort: parseDuration(v.duration) <= 60 ? 'Yes' : 'No',
            }));

        // Build prompt
        const prompt = `
You are Squigly, a brutally honest, elite "God Mode" AI coach for YouTube Shorts creators. 
Your job: Analyze this creator's channel and recent videos with zero sugarcoating. 
Tell them exactly what's working, what's failing, and how to 10x growth fast.

Channel Info:
- Name (how they want to be called): ${channel_name || 'Unknown Creator'}
- About: ${channel_about || 'No description provided'}
- Main Goal: ${goal || 'Grow fast, no specific goal stated'}

Recent Videos Summary (focus on Shorts):
${JSON.stringify(videoSummary, null, 2)}

Analysis Structure (must follow exactly):
1. Overall Channel Reality Check (200-300 words): Compare their stated goal vs actual performance. Be brutally honest about niche, consistency, quality, hooks, trends, thumbnails, titles.
2. What's Working Right Now: Top 3 strengths (e.g., viral hooks, niche fit, engagement spikes).
3. What's Killing Growth: Top 5 biggest mistakes or weaknesses (e.g., weak hooks, bad pacing, no CTA, wrong trends).
4. 30-Day Growth Plan: Clear, step-by-step action plan (numbered 1-10) to fix issues and hit their goal.
5. Expected Results: Realistic prediction if they follow the plan (e.g., "From 1k to 50k views/month").
6. Search the web or youtube for similar successful videos or trends to make content ideas.

Then, provide "Fix It For Me" suggestions as a JSON object:
{
  "description": "Optimized channel description text (full, ready to copy-paste)",
  "shortsTitleTemplate": "Proven Shorts title template with placeholders (e.g., [Hook] + [Topic] + [Emoji])",
  "longformTitleTemplate": "Long-form title template if they do any",
  "hashtags": "10-15 high-performing hashtags tailored to their niche"
}

Output Format:
- First: Full analysis text (sections 1-5 above)
- Then exactly: ---FIXES---
- Then valid JSON object for fixes only

Be direct, motivational, and savage when needed. Use emojis sparingly for emphasis. Focus 80% on Shorts since that's their main content.`;

        // Call Grok API
        const response = await fetch(GROK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROK_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'grok-4-1-fast-reasoning',
                messages: [
                    { role: 'system', content: 'You are Squigly, elite YouTube Shorts coach.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        const responseData = await response.json();  // Get full response for better error

        if (!response.ok) {
            console.error('Grok API failed:', { status: response.status, error: responseData });
            return NextResponse.json({ error: `AI analysis failed: ${responseData.error?.message || 'Unknown error'}` }, { status: 500 });
        }

        const fullText = responseData.choices[0].message.content.trim();

        // Split analysis and fixes
        const [analysisPart, fixesPart] = fullText.split('---FIXES---');
        if (!fixesPart) {
            console.error('Invalid AI response format:', fullText);
            return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 });
        }

        let fixes;
        try {
            fixes = JSON.parse(fixesPart.trim());
        } catch (e) {
            console.error('Failed to parse fixes JSON:', { error: e, raw: fixesPart });
            fixes = {};
        }

        const cleanAnalysis = analysisPart.trim();

        return NextResponse.json({
            analysis: cleanAnalysis,
            fixes,
        });
    } catch (error) {
        console.error('Analyze route error:', error);
        return NextResponse.json({ error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown') }, { status: 500 });
    }
}

// Helper to parse duration
function parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const h = match?.[1] ? parseInt(match[1]) : 0;
    const m = match?.[2] ? parseInt(match[2]) : 0;
    const s = match?.[3] ? parseInt(match[3]) : 0;
    return h * 3600 + m * 60 + s;
}
//forcing a commit change