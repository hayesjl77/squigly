// src/app/privacy/page.tsx
'use client';

import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <>
            {/* Main Privacy Content */}
            <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-black text-white">
                <div className="max-w-4xl mx-auto py-16 px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-gray-400">
                            Last updated: December 22, 2025
                        </p>
                    </div>

                    <div className="prose prose-invert prose-headings:text-purple-300 prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline max-w-none space-y-12 text-gray-300">
                        <p className="text-lg leading-relaxed">
                            Squigly ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").
                        </p>

                        <p className="text-lg leading-relaxed">
                            By using the Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the Service.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            1. Information We Collect
                        </h2>

                        <p className="text-gray-300">
                            We collect information to provide, improve, and secure the Service.
                        </p>

                        <h3 className="text-2xl font-semibold mt-10 mb-4">Personal Data</h3>

                        <p className="text-gray-300">
                            When you authenticate with Google OAuth, we receive:
                        </p>

                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Email address</li>
                            <li>YouTube channel IDs, titles, and basic metadata</li>
                        </ul>

                        <h3 className="text-2xl font-semibold mt-10 mb-4">YouTube Data (with Consent)</h3>

                        <p className="text-gray-300">
                            With your explicit permission via OAuth scopes, we access:
                        </p>

                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Channel statistics and video metadata</li>
                            <li>Analytics data (views, engagement, etc.)</li>
                            <li>Content used for AI-powered analysis</li>
                        </ul>

                        <p className="text-gray-300 mt-4">
                            This data is only used to generate insights and is never sold or shared for marketing.
                        </p>

                        <h3 className="text-2xl font-semibold mt-10 mb-4">Usage Data</h3>

                        <p className="text-gray-300">
                            We collect information such as IP address, browser type, pages visited, time spent, device identifiers, and diagnostic data to improve the Service.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            2. How We Use Your Information
                        </h2>

                        <ul className="list-disc pl-6 space-y-3 mt-4">
                            <li>To provide and maintain the core AI analysis features</li>
                            <li>To improve the Service, fix bugs, and develop new features</li>
                            <li>To communicate with you about your account and the Service</li>
                            <li>To detect, prevent, and address technical issues or abuse</li>
                        </ul>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            3. Data Storage & Security
                        </h2>

                        <p className="text-gray-300">
                            Data is stored securely in Supabase (EU/US regions) with encrypted OAuth tokens. Access is restricted to authenticated users only.
                        </p>

                        <p className="text-gray-300 mt-4">
                            We use industry-standard security measures (TLS in transit, encryption at rest where applicable). However, no method of transmission over the Internet is 100% secure.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            4. Third-Party Services
                        </h2>

                        <p className="text-gray-300">
                            We integrate with:
                        </p>

                        <ul className="list-disc pl-6 space-y-3 mt-4">
                            <li>Google/YouTube APIs (data access & analytics)</li>
                            <li>xAI Grok models (AI processing)</li>
                            <li>Supabase (auth & storage)</li>
                            <li>Stripe (payments for subscriptions)</li>
                        </ul>

                        <p className="text-gray-300 mt-4">
                            Each provider has its own privacy policy.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            5. Your Data Protection Rights
                        </h2>

                        <p className="text-gray-300">
                            Depending on your location, you may have rights to:
                        </p>

                        <ul className="list-disc pl-6 space-y-3 mt-4">
                            <li>Access your personal data</li>
                            <li>Request correction or deletion</li>
                            <li>Restrict or object to processing</li>
                            <li>Data portability</li>
                        </ul>

                        <p className="text-gray-300 mt-6">
                            To exercise these rights, contact us at <strong>contactsquigai@gmail.com</strong>.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            6. Changes to This Privacy Policy
                        </h2>

                        <p className="text-gray-300">
                            We may update this policy from time to time. Changes will be posted here with an updated "Last updated" date. We encourage you to review this page periodically.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            7. Contact Us
                        </h2>

                        <p className="text-gray-300 text-lg">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>

                        <p className="text-purple-400 text-xl font-medium mt-6">
                            Email: contactsquigai@gmail.com
                        </p>
                    </div>

                    <div className="mt-20 text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} Squigly. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}