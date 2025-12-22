// app/api/stripe/portal/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()

    if (error || !data?.stripe_customer_id) {
        return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
    }

    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: data.stripe_customer_id,
            return_url: process.env.NEXT_PUBLIC_SITE_URL!,
        })

        return NextResponse.json({ url: portalSession.url })
    } catch (err: any) {
        console.error('Stripe portal error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}