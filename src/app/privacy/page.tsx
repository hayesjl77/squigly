export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white py-16">
            <div className="max-w-4xl mx-auto px-8">
                <h1 className="text-5xl font-bold mb-12 text-center">Privacy Policy</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-8">Last updated: December 22, 2025</p>

                    <h2 className="text-3xl font-bold mt-12 mb-6">Information We Collect</h2>
                    <p>We collect YouTube channel data, video metadata, analytics (with your consent via OAuth), and usage data for AI analysis.</p>

                    <h2 className="text-3xl font-bold mt-12 mb-6">How We Use Your Information</h2>
                    <p>Your data is used solely to provide AI analysis and improve the service. We do not sell your personal data.</p>

                    <h2 className="text-3xl font-bold mt-12 mb-6">Data Storage & Security</h2>
                    <p>Data is stored securely in Supabase (EU/US regions). Tokens are encrypted.</p>

                    {/* Add more: Third-party services (YouTube API, xAI), Your rights, Changes to policy */}

                    <h2 className="text-3xl font-bold mt-12 mb-6">Contact</h2>
                    <p>privacy@squigly.ai</p>
                </div>
            </div>
        </div>
    );
}