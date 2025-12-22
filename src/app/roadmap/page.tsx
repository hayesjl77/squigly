// src/app/roadmap/page.tsx

export default function Roadmap() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
                        Squigly Roadmap
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Our vision: Become the ultimate AI-powered hub for short-form video creators across all major platforms.
                    </p>
                </div>

                {/* Completed Section */}
                <section className="mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-purple-400 flex items-center gap-3">
                        <span className="text-5xl">✓</span> What We've Built So Far
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-2xl font-semibold mb-3">YouTube Integration</h3>
                            <p className="text-gray-300">
                                Seamless Google OAuth, channel connection (multiple accounts), video/short analytics, and deep AI analysis with rate limiting.
                            </p>
                        </div>
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-2xl font-semibold mb-3">Core AI Engine</h3>
                            <p className="text-gray-300">
                                Basic video content analysis, transcription/summarization, optimization suggestions (titles, descriptions, hashtags).
                            </p>
                        </div>
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-2xl font-semibold mb-3">Production Ready</h3>
                            <p className="text-gray-300">
                                Vercel deployment, Supabase backend, responsive UI, dark mode, subscription tiers.
                            </p>
                        </div>
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-2xl font-semibold mb-3">User Experience</h3>
                            <p className="text-gray-300">
                                Profile customization, saved analyses, hourly/monthly limits with clear messaging.
                            </p>
                        </div>
                    </div>
                </section>

                {/* In Progress */}
                <section className="mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-yellow-400 flex items-center gap-3">
                        <span className="text-5xl">⚙️</span> Currently In Progress
                    </h2>
                    <ul className="list-disc pl-8 space-y-4 text-lg">
                        <li>Resolving OAuth redirect flows for perfect production onboarding.</li>
                        <li>UI polish: better mobile responsiveness, loading states, and visual feedback.</li>
                        <li>Enhanced caching & performance for faster repeated analyses.</li>
                    </ul>
                </section>

                {/* Future Plans */}
                <section>
                    <h2 className="text-4xl font-bold mb-8 text-pink-500 flex items-center gap-3">
                        <span className="text-5xl">🚀</span> Future Plans (2026 & Beyond)
                    </h2>
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-2xl font-bold mb-3">Multi-Platform Expansion</h3>
                            <p className="text-gray-300 mb-3">
                                Integrate <strong>TikTok</strong> (using official Search/Discovery APIs + reliable third-party wrappers for trends/metadata),
                                <strong>Instagram Reels</strong> (via Graph API for analytics, insights, and publishing support), and
                                <strong>X/Twitter</strong> (short-form videos/threads via API v2).
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                Goal: One dashboard to rule them all — analyze performance across platforms in real time.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-3">Next-Level AI Video Understanding</h3>
                            <p className="text-gray-300 mb-3">
                                Upgrade to state-of-the-art multimodal models (e.g. advanced Whisper variants for transcription,
                                CLIP/GPT-4o-like for visual + audio sentiment, emotion detection, key moment extraction,
                                viral potential scoring, and real-time live stream processing).
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                2025 trends show massive improvements in context-aware, sarcasm-detecting, and cross-modal AI.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-3">Creator Power Tools</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-300">
                                <li>AI script writer, thumbnail generator (DALL·E/Flux/SD3 integration), auto-editing suggestions</li>
                                <li>Competitor analysis & trend prediction dashboard</li>
                                <li>Cross-posting scheduler + performance comparison</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-3">Community & Monetization</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-300">
                                <li>Freemium → Pro tiers with AI credits, priority processing</li>
                                <li>User forum, waitlist, GitHub contributions</li>
                                <li>Team collaboration workspaces</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-2xl font-bold text-purple-300 mb-4">
                            We're moving fast — the future of creator tools is AI-first & multi-platform!
                        </p>
                        <p className="text-lg text-gray-400">
                            Star us on GitHub, suggest features, or join the waitlist. Let's build it together. ⭐
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}