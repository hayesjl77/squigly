// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';  // ← This line fixes the type error
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    const sig = request.headers.get('stripe-signature') as string;
    const payload = await request.text();

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.client_reference_id;
        const tier = session.metadata?.tier;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string | null;

        if (!userId || !customerId) {
            console.error('Missing userId or customerId in session');
            return NextResponse.json({ received: true });
        }

        // Upsert subscription row
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: userId,
                status: 'active',  // Or 'trialing' / 'past_due' based on event
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                tier: tier || 'unknown',
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: false
            });

        if (error) {
            console.error('Failed to save subscription:', error);
        } else {
            console.log('Subscription saved/updated for user:', userId);
        }
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
}