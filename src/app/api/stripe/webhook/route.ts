// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Instantiate Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    const sig = request.headers.get('stripe-signature') as string;
    const payload = await request.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
        console.log('Webhook event received:', event.type);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Handle successful checkout/payment
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

        // Map tier to status value (must match your check constraint)
        let newStatus = 'free';
        if (tier === 'starter') {
            newStatus = 'starter';
        } else if (tier === 'pro' || tier === 'test') {  // Treat test as pro for limits
            newStatus = 'pro';
        }

        // Upsert subscription row
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: userId,
                status: newStatus,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: false,
            });

        if (error) {
            console.error('Failed to save subscription:', error);
        } else {
            console.log('Subscription saved/updated for user:', userId, { status: newStatus });
        }
    }

    // Handle subscription cancel or update
    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId = subscription.customer as string;
        const status = subscription.status === 'canceled' ? 'canceled' : subscription.status;

        // Lookup user by customer ID
        const { data: subData, error: lookupError } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single();

        if (lookupError || !subData) {
            console.error('No subscription found for customer:', customerId);
            return NextResponse.json({ received: true });
        }

        const userId = subData.user_id;

        // Update status
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (error) {
            console.error('Failed to update subscription status:', error);
        } else {
            console.log('Subscription status updated to', status, 'for user:', userId);
        }
    }

    // Acknowledge receipt
    return NextResponse.json({ received: true });
}