// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { userId, tier } = body

    if (!userId || !tier) {
        return NextResponse.json({ error: 'Missing userId or tier' }, { status: 400 })
    }

    const priceId = tier === 'pro' ? process.env.STRIPE_PRICE_ID_PRO! : process.env.STRIPE_PRICE_ID_STARTER!

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?canceled=true`,
            client_reference_id: userId,
            metadata: { tier },
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}