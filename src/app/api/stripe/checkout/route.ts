// src/app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, tier } = body;

        if (!userId || !tier || !['starter', 'pro'].includes(tier)) {
            return NextResponse.json({ error: 'Missing or invalid userId/tier' }, { status: 400 });
        }

        const priceId = tier === 'pro'
            ? process.env.STRIPE_PRICE_ID_PRO
            : process.env.STRIPE_PRICE_ID_STARTER;

        if (!priceId) {
            console.error(`Missing price ID for tier: ${tier}`);
            return NextResponse.json({ error: 'Server configuration error - missing price ID' }, { status: 500 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?canceled=true`,
            client_reference_id: userId,
            metadata: { tier },
        });

        if (!session.url) {
            throw new Error('No checkout URL returned from Stripe');
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe checkout error:', error.message || error);
        return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 });
    }
}