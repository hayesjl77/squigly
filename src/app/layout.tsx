// src/app/layout.tsx
import type { Metadata } from 'next';
import AuthHeader from '@/components/AuthHeader';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import './globals.css';

export const metadata: Metadata = {
    title: 'Squigly - AI Video Coach',
    description: 'AI-powered analysis and optimization for YouTube creators',
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    // Await the async server client
    const supabase = await createServerSupabaseClient();

    // Use getUser() for security (validates on server)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Optional: full session for provider compatibility
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return (
        <html lang="en">
        <body className="bg-gradient-to-b from-[#0f172a] to-black text-white antialiased">
        <SupabaseProvider initialSession={session}>
            <AuthHeader />
            {children}
        </SupabaseProvider>
        </body>
        </html>
    );
}