import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('waitlist')
            .insert([{ email: email.trim().toLowerCase() }])
            .select()

        if (error) {
            if (error.code === '23505') { // duplicate email
                return NextResponse.json({ message: 'You’re already on the Squigly waitlist!' })
            }
            return NextResponse.json({ error: 'Something went wrong. Try again later.' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Welcome to Squigly! You’re on the early access list 🎉' })
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}