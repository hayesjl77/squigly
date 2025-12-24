// src/app/api/stripe/portal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,  // Use service role for server
        { cookies: () => cookieStore }
    );

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized - no user' }, { status: 401 });
    }

    // Fetch subscription from Supabase
    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

    if (error || !subscription?.stripe_customer_id) {
        console.error('No subscription or customer ID found:', error);
        return NextResponse.json({ error: 'No billing information found' }, { status: 404 });
    }

    const customerId = subscription.stripe_customer_id;

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,  // Back to pricing after
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Portal session error:', err);
        return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
    }
}