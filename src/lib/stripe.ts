// lib/stripe.ts (should look like this)
'server only';

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover', // current latest stable (Dec 2025)
});

export default stripeInstance;