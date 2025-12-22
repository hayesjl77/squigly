// src/app/layout.tsx
import type { Metadata } from 'next';
import Header from '@/components/Header'; // adjust path if needed
import './globals.css'; // if you have global styles

export const metadata: Metadata = {
    title: 'Squigly - AI Video Analysis',
    description: 'AI-powered content creation coach and analysis tool',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gradient-to-b from-[#0f172a] to-black text-white antialiased">
        <Header />
        {children}
        </body>
        </html>
    );
}