// src/app/login/page.tsx
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function LoginPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If already authenticated → go home
    if (user) {
        redirect('/');
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 sm:p-8"
            style={{ backgroundImage: "url('/images/background.png')" }}
        >
            <div className="text-center space-y-10 sm:space-y-16 max-w-4xl">
                <img
                    src="/images/Squigly_Logo.png"
                    alt="Squigly"
                    className="mx-auto w-auto h-64 sm:h-80 md:h-[420px] lg:h-[500px] drop-shadow-2xl"
                />

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                    Welcome to Squigly
                </h1>

                <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-light max-w-3xl mx-auto">
                    Your personal AI coach for YouTube growth — deep analysis, smart fixes, better content
                </p>

                <div className="pt-6 sm:pt-10">
                    <button
                        onClick={async () => {
                            'use client';
                            const { supabase: client } = await import('@/components/Providers');
                            await client.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: `${window.location.origin}/api/auth/callback`,
                                    scopes:
                                        'https://www.googleapis.com/auth/youtube.readonly ' +
                                        'https://www.googleapis.com/auth/yt-analytics.readonly ' +
                                        'https://www.googleapis.com/auth/analytics.readonly',
                                },
                            });
                        }}
                        className="px-10 sm:px-16 py-5 sm:py-6 bg-white text-black font-bold text-xl sm:text-2xl rounded-full hover:bg-gray-100 transition shadow-2xl hover:shadow-purple-500/40 flex items-center justify-center gap-4 mx-auto transform hover:scale-105 active:scale-100"
                    >
                        <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>

                <p className="text-sm sm:text-base text-gray-400 pt-8">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-purple-400 hover:underline">Terms</a> and{' '}
                    <a href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}