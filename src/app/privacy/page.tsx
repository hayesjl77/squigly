// src/app/privacy/page.tsx
export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-black text-white py-16 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-gray-400">
                        Last updated: December 22, 2025
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-headings:text-purple-300 prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline max-w-none space-y-12 text-gray-300">
                    <p className="text-lg leading-relaxed">
                        Squigly ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").
                    </p>

                    <p className="text-lg leading-relaxed">
                        By using the Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the Service.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">1. Information We Collect</h2>
                    <p className="text-gray-300">
                        We collect several different types of information for various purposes to provide and improve our Service to you.
                    </p>

                    <h3 className="text-2xl font-semibold mt-10 mb-4">Personal Data</h3>
                    <p className="text-gray-300">
                        While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Email address (from Google OAuth)</li>
                        <li>YouTube channel IDs, titles, and metadata</li>
                        <li>Usage data (analyses performed, timestamps, preferences)</li>
                    </ul>

                    <h3 className="text-2xl font-semibold mt-10 mb-4">Usage Data</h3>
                    <p className="text-gray-300">
                        We also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Usage Data").
                    </p>
                    <p className="text-gray-300 mt-4">
                        This Usage Data may include information such as your computer's Internet Protocol address (IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                    </p>

                    <h3 className="text-2xl font-semibold mt-10 mb-4">YouTube Data (via OAuth)</h3>
                    <p className="text-gray-300">
                        With your explicit consent through Google OAuth, we access:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Your YouTube channel(s) data</li>
                        <li>Video metadata and statistics</li>
                        <li>Analytics reports (views, engagement, etc.)</li>
                    </ul>
                    <p className="text-gray-300 mt-4">
                        This data is only used to provide AI-powered analysis and is never shared with third parties for marketing purposes.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">2. How We Use Your Information</h2>
                    <p className="text-gray-300">
                        We use the collected data for various purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 mt-4">
                        <li>To provide and maintain the Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To allow you to participate in interactive features</li>
                        <li>To provide customer care and support</li>
                        <li>To gather analysis or valuable information so that we can improve the Service</li>
                        <li>To monitor the usage of the Service</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">3. Data Storage & Security</h2>
                    <p className="text-gray-300">
                        Your data is stored securely using Supabase (hosted in EU/US regions depending on your location) with encrypted OAuth tokens and access restricted to authenticated users only.
                    </p>
                    <p className="text-gray-300 mt-4">
                        We implement industry-standard security measures, including encryption in transit (TLS) and at rest where applicable. However, no method of transmission over the Internet or electronic storage is 100% secure.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">4. Third-Party Services</h2>
                    <p className="text-gray-300">
                        We use the following third-party services:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 mt-4">
                        <li><strong>Google/YouTube APIs</strong> — for channel data and analytics (subject to Google's privacy policy)</li>
                        <li><strong>xAI Grok models</strong> — for AI analysis (subject to xAI's terms)</li>
                        <li><strong>Supabase</strong> — for authentication and data storage</li>
                        <li><strong>Stripe</strong> — for payment processing (if you subscribe to paid plans)</li>
                    </ul>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">5. Your Data Protection Rights</h2>
                    <p className="text-gray-300">
                        Depending on your location, you may have the following rights regarding your Personal Data:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 mt-4">
                        <li>The right to access – request copies of your personal data</li>
                        <li>The right to rectification – request correction of inaccurate data</li>
                        <li>The right to erasure – request deletion of your data</li>
                        <li>The right to restrict processing</li>
                        <li>The right to object to processing</li>
                        <li>The right to data portability</li>
                    </ul>
                    <p className="text-gray-300 mt-6">
                        To exercise any of these rights, contact us at <strong>contactsquigai@gmail.com</strong>.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">6. Changes to This Privacy Policy</h2>
                    <p className="text-gray-300">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                    <p className="text-gray-300 mt-4">
                        You are advised to review this Privacy Policy periodically for any changes. Changes are effective when they are posted on this page.
                    </p>

                    <h2 className="text-4xl font-bold mt-16 mb-6 border-b border-gray-700 pb-4">7. Contact Us</h2>
                    <p className="text-gray-300 text-lg">
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <p className="text-purple-400 text-xl font-medium mt-6">
                        Email: contactsquigai@gmail.com
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-20 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Squigly. All rights reserved.
                </div>
            </div>
        </div>
    );
}