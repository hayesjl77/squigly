import { NextRequest, NextResponse } from 'next/server';  // ← ADD THIS LINE
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, tier } = body;

        if (!userId || !tier || !['starter', 'pro', 'test'].includes(tier)) {  // ← Add 'test'
            return NextResponse.json({ error: 'Missing or invalid userId/tier' }, { status: 400 });
        }

        let priceId;
        if (tier === 'test') {
            // TEMP: Live $1 test product - REMOVE AFTER TEST
            priceId = 'price_1ShmAu506PTuQJZKCIFPJc8c';  // ← YOUR NEW LIVE $1 PRICE ID
        } else {
            priceId = tier === 'pro' ? process.env.STRIPE_PRICE_ID_PRO : process.env.STRIPE_PRICE_ID_STARTER;
        }

        if (!priceId) {
            console.error(`Missing price ID for tier: ${tier}`);
            return NextResponse.json({ error: 'Server configuration error - missing price ID' }, { status: 500 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',  // Use 'payment' for one-time test (or 'subscription' if you made it recurring)
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?canceled=true`,
            client_reference_id: userId,
            metadata: { tier },  // ← Keeps metadata.tier = 'test' for webhook
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