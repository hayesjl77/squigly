import type { Metadata } from "next";
import "./globals.css"; // if you have global styles

export const metadata: Metadata = {
    title: "Squigly - AI Video Coach",
    description: "AI-powered analysis and optimization for YouTube creators",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="bg-gradient-to-b from-[#0f172a] to-black text-white antialiased">
        {children}
        </body>
        </html>
    );
}