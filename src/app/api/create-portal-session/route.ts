// app/api/create-portal-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/auth'; // or your auth method (NextAuth, Clerk, etc.)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20', // or your preferred version
});

export async function POST() {
    try {
        const session = await auth(); // Get current user session
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch your user from DB (you must have stored stripeCustomerId)
        // Example with Prisma:
        // const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        const stripeCustomerId = user?.stripeCustomerId; // ← This is critical!

        if (!stripeCustomerId) {
            return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`, // ← absolute URL! e.g. https://squigly.vercel.app/account
            // Optional: specify a config if you have multiple portal configs
            // configuration: 'bpc_xxx' // from Dashboard if needed
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: any) {
        console.error('Portal session error:', error);
        return NextResponse.json(
            { error: 'Failed to create billing portal session', details: error.message },
            { status: 500 }
        );
    }
}