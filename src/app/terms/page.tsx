export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white py-16">
            <div className="max-w-4xl mx-auto px-8">
                <h1 className="text-5xl font-bold mb-12 text-center">Terms of Service</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-8">Last updated: December 22, 2025</p>

                    <h2 className="text-3xl font-bold mt-12 mb-6">1. Acceptance of Terms</h2>
                    <p>By accessing or using Squigly ("the Service"), you agree to be bound by these Terms of Service.</p>

                    <h2 className="text-3xl font-bold mt-12 mb-6">2. Description of Service</h2>
                    <p>Squigly provides AI-powered analysis tools for YouTube creators using data from the YouTube API and xAI Grok models.</p>

                    <h2 className="text-3xl font-bold mt-12 mb-6">3. User Accounts</h2>
                    <p>You must use a valid Google account to authenticate. You are responsible for maintaining the confidentiality of your account.</p>

                    {/* Add more sections: Payments, Usage Limits, Intellectual Property, Limitation of Liability, etc. */}

                    <h2 className="text-3xl font-bold mt-12 mb-6">Contact</h2>
                    <p>For questions about these Terms, contact us at [your-email@example.com].</p>
                </div>
            </div>
        </div>
    );
}