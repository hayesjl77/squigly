// src/app/login/page.tsx
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import GoogleSignInButton from '@/components/GoogleSignInButton'; // Client component with the button

export default async function LoginPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If user is already authenticated → redirect to dashboard
    if (user) {
        redirect('/');
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 sm:p-8"
            style={{ backgroundImage: "url('/images/background.png')" }}
        >
            <div className="text-center space-y-10 sm:space-y-16 max-w-4xl">
                {/* Logo */}
                <img
                    src="/images/Squigly_Logo.png"
                    alt="Squigly"
                    className="mx-auto w-auto h-64 sm:h-80 md:h-[420px] lg:h-[500px] drop-shadow-2xl"
                />

                {/* Main heading */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                    Welcome to Squigly
                </h1>

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-light max-w-3xl mx-auto">
                    Your personal AI coach for YouTube growth — deep analysis, smart fixes, better content
                </p>

                {/* Sign-in button (client component) */}
                <div className="pt-6 sm:pt-10">
                    <GoogleSignInButton />
                </div>

                {/* Legal footer */}
                <p className="text-sm sm:text-base text-gray-400 pt-8">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-purple-400 hover:underline">Terms</a> and{' '}
                    <a href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}