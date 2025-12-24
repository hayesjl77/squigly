// src/app/terms/page.tsx
'use client';

import Link from 'next/link';

export default function TermsPage() {
    return (
        <>
           {/* Main Terms Content */}
            <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-black text-white">
                <div className="max-w-4xl mx-auto py-16 px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-xl text-gray-400">
                            Last updated: December 22, 2025
                        </p>
                    </div>

                    <div className="prose prose-invert prose-headings:text-purple-300 prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline max-w-none space-y-12 text-gray-300">
                        <p className="text-lg leading-relaxed">
                            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Squigly website and mobile application (the "Service") operated by Squigly ("us", "we", or "our").
                        </p>

                        <p className="text-lg leading-relaxed">
                            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                        </p>

                        <p className="text-lg leading-relaxed font-semibold">
                            By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            1. Acceptance of Terms
                        </h2>

                        <p className="text-gray-300">
                            By accessing or using Squigly ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, you must not use the Service.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            2. Description of Service
                        </h2>

                        <p className="text-gray-300">
                            Squigly provides AI-powered analysis tools for YouTube creators using data from the YouTube Data API, YouTube Analytics API, and advanced AI models (including xAI Grok) to deliver insights, optimization suggestions, and analytics.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            3. User Accounts & Authentication
                        </h2>

                        <p className="text-gray-300">
                            You must authenticate using a valid Google account via OAuth. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>

                        <p className="text-gray-300 mt-4">
                            You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            4. Payments & Subscriptions
                        </h2>

                        <p className="text-gray-300">
                            Certain features are available only through paid subscriptions ("Subscription(s)"). Billing occurs in advance on a recurring basis ("Billing Cycle"). At the end of each cycle, your Subscription will automatically renew unless canceled.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            5. Usage Limits & Fair Use
                        </h2>

                        <p className="text-gray-300">
                            Free and paid plans include usage quotas (e.g., analyses per hour/month). Exceeding limits may result in temporary throttling or suspension until the reset period. You agree not to abuse the service, circumvent limits, or use automated means to generate excessive requests.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            6. Intellectual Property
                        </h2>

                        <p className="text-gray-300">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of Squigly and its licensors. The Service is protected by copyright, trademark, and other laws.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            7. Limitation of Liability
                        </h2>

                        <p className="text-gray-300">
                            In no event shall Squigly, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            8. Termination
                        </h2>

                        <p className="text-gray-300">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including breach of these Terms.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            9. Governing Law
                        </h2>

                        <p className="text-gray-300">
                            These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            10. Changes to Terms
                        </h2>

                        <p className="text-gray-300">
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice before new terms take effect.
                        </p>

                        <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">
                            Contact Us
                        </h2>

                        <p className="text-gray-300 text-lg">
                            If you have any questions about these Terms, please contact us at:
                        </p>

                        <p className="text-purple-400 text-xl font-medium mt-6">
                            support@squigly.app
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