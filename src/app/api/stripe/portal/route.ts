// app/api/stripe/portal/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'; // or your supabase client setup

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for server
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Fetch user from Supabase (or your subscriptions table)
        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id') // ← Important column! Make sure this exists in your table
            .eq('user_id', userId)
            .single();

        if (error || !subscription?.stripe_customer_id) {
            console.error('No customer ID found:', error);
            return NextResponse.json(
                { error: 'No Stripe customer associated with this user' },
                { status: 400 }
            );
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, // or /account, /home – absolute URL!
            // Optional: limit features or use specific config
            // configuration: 'bpc_xxx...' (if you created custom config in dashboard)
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: any) {
        console.error('Stripe portal error:', error);
        return NextResponse.json(
            { error: 'Failed to create billing portal', details: error.message },
            { status: 500 }
        );
    }
}