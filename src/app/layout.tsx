// src/app/layout.tsx
import type { Metadata } from 'next';
import AuthHeader from '@/components/AuthHeader'; // adjust path if needed
import './globals.css';

export const metadata: Metadata = {
    title: 'Squigly - AI Video Coach',
    description: 'AI-powered analysis and optimization for YouTube creators',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="bg-gradient-to-b from-[#0f172a] to-black text-white antialiased">
        <AuthHeader /> {/* ← Add here – shows on ALL pages */}
        {children}
        </body>
        </html>
    );
}