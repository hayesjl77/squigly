// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as any;
                const userId = session.client_reference_id;

                if (!userId) {
                    console.log('No userId in session');
                    return NextResponse.json({ received: true });
                }

                // Only process if payment succeeded
                if (session.payment_status !== 'paid') {
                    console.log('Payment not paid:', session.payment_status);
                    return NextResponse.json({ received: true });
                }

                const tier = session.metadata?.tier || 'starter';
                const status = tier === 'pro' ? 'pro' : 'starter';

                console.log(`Upserting subscription for user ${userId} as ${status}`);

                const { error } = await supabaseAdmin
                    .from('subscriptions')
                    .upsert({
                        user_id: userId,
                        status,
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: session.subscription as string,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'user_id' });

                if (error) {
                    console.error('Supabase upsert error:', error);
                    return NextResponse.json({ error: 'DB error' }, { status: 500 });
                }

                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any;
                const { error } = await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        status: 'canceled',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                if (error) {
                    console.error('Subscription cancel error:', error);
                }

                break;
            }

            case 'invoice.payment_succeeded': {
                // Handle recurring payments (renewals)
                const invoice = event.data.object as any;
                const subscriptionId = invoice.subscription;

                const { data: subData } = await supabaseAdmin
                    .from('subscriptions')
                    .select('user_id')
                    .eq('stripe_subscription_id', subscriptionId)
                    .single();

                if (subData?.user_id) {
                    // Optional: update last payment date or status
                    await supabaseAdmin
                        .from('subscriptions')
                        .update({
                            status: 'active',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('user_id', subData.user_id);
                }

                break;
            }

            case 'invoice.payment_failed': {
                // Handle failed renewals
                const invoice = event.data.object as any;
                console.log('Payment failed for invoice:', invoice.id);
                // Optional: notify user or downgrade status
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Webhook handler error:', err.message || err);
        return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
    }
}