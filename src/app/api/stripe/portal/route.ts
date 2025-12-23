// app/api/stripe/portal/route.ts
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        // Get authenticated user from cookies (no client-sent userId needed)
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();

        if (authError || !user) {
            console.error('Auth error:', authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id; // Now safe – comes from server-verified auth

        // Fetch subscription
        const { data: subscription, error: subError } = await supabaseAdmin
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .single();

        if (subError || !subscription?.stripe_customer_id) {
            console.error('Subscription/customer lookup failed:', subError);
            return NextResponse.json(
                { error: 'No active Stripe customer found for this user' },
                { status: 400 }
            );
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Portal session creation failed:', { message: errorMessage });
        return NextResponse.json(
            { error: 'Failed to create billing portal session' },
            { status: 500 }
        );
    }
}