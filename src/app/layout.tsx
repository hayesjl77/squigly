// src/app/layout.tsx
import type { Metadata } from 'next';
import AuthHeader from '@/components/AuthHeader';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import { createSupabaseServerClient } from '@/lib/supabase/server'; // ← new import
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
    const supabase = await createSupabaseServerClient();

    // Safer on server: use getUser() instead of getSession()
    const { data: { user } } = await supabase.auth.getUser();

    // For the provider, we can pass null or construct a minimal session-like object
    // But since your provider expects Session | null, and we only need user, adjust if needed
    // Here we fetch a full session for compatibility (some setups use getSession() after proxy/middleware)
    const { data: { session } } = await supabase.auth.getSession(); // Use cautiously

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