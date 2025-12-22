// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')!

    let event

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any
            const userId = session.client_reference_id

            if (!userId) {
                console.log('No userId in session')
                return NextResponse.json({ received: true })
            }

            // Get tier from metadata (sent from checkout)
            const tier = session.metadata?.tier || 'starter'  // fallback
            const status = tier === 'pro' ? 'pro' : 'starter'

            console.log(`Upserting subscription for user ${userId} as ${status}`)

            const { error } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    status,
                    stripe_customer_id: session.customer,
                    stripe_subscription_id: session.subscription,
                }, { onConflict: 'user_id' })  // Important: conflict on user_id

            if (error) {
                console.error('Supabase upsert error:', error)
                return NextResponse.json({ error: 'DB error' }, { status: 500 })
            }
        }

        // Handle cancellation
        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as any
            const { error } = await supabaseAdmin
                .from('subscriptions')
                .update({ status: 'canceled' })
                .eq('stripe_subscription_id', subscription.id)

            if (error) console.error('Cancel error:', error)
        }

        return NextResponse.json({ received: true })
    } catch (err: any) {
        console.error('Webhook handler error:', err)
        return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
}