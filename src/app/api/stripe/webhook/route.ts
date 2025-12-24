// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
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

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string | null;

        if (!userId || !customerId) {
            console.error('Missing userId or customerId in session');
            return NextResponse.json({ received: true });
        }

        // Upsert subscription row - using existing 'status' column, no 'tier'
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: userId,
                status: 'active',  // Sets to active on successful payment
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
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

    return NextResponse.json({ received: true });
}