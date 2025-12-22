// app/api/stripe/portal/route.ts
import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';              // Use default import (matches export default in lib/stripe.ts)
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (typeof userId !== 'string' || !userId) {
            return NextResponse.json(
                { error: 'Valid user ID is required' },
                { status: 400 }
            );
        }

        // Verify the caller is authenticated (uses cookies from request)
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();

        if (authError || !user || user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch subscription with stripe_customer_id
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
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, // ensure this env var is set correctly in Vercel
            // configuration: 'bpc_xxxxxxxxxxxxxxxxxxxxxx', // optional: if using custom portal config in dashboard
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        console.error('Portal session creation failed:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });

        return NextResponse.json(
            {
                error: 'Failed to create billing portal session',
                ...(process.env.NODE_ENV === 'development' && { details: errorMessage }),
            },
            { status: 500 }
        );
    }
}