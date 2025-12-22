// src/app/terms/page.tsx
export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-black text-white py-16 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-gray-400">
                        Last updated: December 22, 2025
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-headings:text-purple-300 prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline max-w-none space-y-12">
                    <p className="text-lg leading-relaxed text-gray-300">
                        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Squigly website and mobile application (the "Service") operated by Squigly ("us", "we", or "our").
                    </p>

                    <p className="text-lg leading-relaxed text-gray-300">
                        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                    </p>

                    <p className="text-lg leading-relaxed text-gray-300 font-semibold">
                        By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">1. Accounts</h2>
                    <p className="text-gray-300">
                        When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p className="text-gray-300">
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                    </p>
                    <p className="text-gray-300">
                        You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">2. Description of the Service</h2>
                    <p className="text-gray-300">
                        Squigly provides AI-powered analysis tools for content creators, primarily focused on YouTube channels. The Service uses data from the YouTube Data API, YouTube Analytics API, and AI models (including xAI Grok) to provide insights, optimization suggestions, and analytics.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">3. Payments & Subscriptions</h2>
                    <p className="text-gray-300">
                        Certain features of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly basis.
                    </p>
                    <p className="text-gray-300">
                        At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or Squigly cancels it. You may cancel your Subscription renewal through your online account management page.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">4. Usage Limits & Fair Use</h2>
                    <p className="text-gray-300">
                        Free and paid plans have usage limits (e.g., number of analyses per hour/month). Exceeding these limits may result in temporary suspension or throttling until the next reset period.
                    </p>
                    <p className="text-gray-300">
                        You agree not to abuse the Service, circumvent rate limits, or use automated means to generate excessive requests.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">5. Intellectual Property</h2>
                    <p className="text-gray-300">
                        The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Squigly and its licensors. The Service is protected by copyright, trademark, and other laws.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">6. User Content</h2>
                    <p className="text-gray-300">
                        You retain ownership of any content you submit, post or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute it solely for operating and improving the Service.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">7. Limitation of Liability</h2>
                    <p className="text-gray-300">
                        In no event shall Squigly, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">8. Termination</h2>
                    <p className="text-gray-300">
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">9. Governing Law</h2>
                    <p className="text-gray-300">
                        These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">10. Changes to Terms</h2>
                    <p className="text-gray-300">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">Contact Us</h2>
                    <p className="text-gray-300 text-lg">
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="text-purple-400 text-xl font-medium mt-4">
                        contactsquigai@gmail.com
                    </p>
                </div>

                {/* Footer note */}
                <div className="mt-20 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Squig AI. All rights reserved.
                </div>
            </div>
        </div>
    );
}