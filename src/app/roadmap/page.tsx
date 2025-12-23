// src/app/roadmap/page.tsx
'use client';

import Link from 'next/link';

export default function Roadmap() {
    return (
        <>
            {/* Simple shared header for public page */}
            <header className="border-b border-gray-800 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <img src="/images/Squigly_Logo.png" alt="Squigly Logo" className="h-12 w-auto drop-shadow-lg" />
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                Squigly
                            </h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-xl text-gray-300 hover:text-white transition">
                                Home
                            </Link>
                            <Link href="/pricing" className="text-xl text-gray-300 hover:text-white transition">
                                Pricing
                            </Link>
                            <Link href="/terms" className="text-xl text-gray-300 hover:text-white transition">
                                Terms
                            </Link>
                            <Link href="/privacy" className="text-xl text-gray-300 hover:text-white transition">
                                Privacy
                            </Link>
                            <Link href="/roadmap" className="text-xl text-purple-400 hover:text-purple-300 transition font-medium">
                                Roadmap
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Roadmap Content */}
            <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-black text-white">
                <div className="max-w-6xl mx-auto py-16 px-6">
                    {/* Hero */}
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 tracking-tight">
                            Squigly Roadmap
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-light">
                            Building the most powerful AI companion for short-form video creators — across every major platform.
                        </p>
                    </div>

                    {/* Completed */}
                    <section className="mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-purple-400 flex items-center gap-4 justify-center md:justify-start">
                            <span className="text-6xl">✓</span> Already Shipped
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "YouTube Integration",
                                    desc: "Full Google OAuth, multi-account support, video & Shorts analytics, rate-limited deep AI analysis",
                                },
                                {
                                    title: "Core AI Analysis",
                                    desc: "Video transcription, summarization, title/description/hashtag optimization suggestions",
                                },
                                {
                                    title: "Production Infrastructure",
                                    desc: "Vercel deployment, Supabase backend, responsive design, dark mode, tiered subscriptions",
                                },
                                {
                                    title: "User Experience",
                                    desc: "Custom channel profiles, saved analyses, clear hourly/monthly rate limit messaging",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                                >
                                    <h3 className="text-2xl font-semibold mb-4 text-purple-300">{item.title}</h3>
                                    <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* In Progress */}
                    <section className="mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-yellow-400 flex items-center gap-4 justify-center md:justify-start">
                            <span className="text-6xl">⚙️</span> In Active Development
                        </h2>
                        <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50 max-w-4xl mx-auto">
                            <ul className="space-y-6 text-lg text-gray-200 list-disc pl-6 marker:text-yellow-400">
                                <li className="pl-2">Fixing OAuth redirect flows for seamless production onboarding</li>
                                <li className="pl-2">UI/UX polish: better mobile experience, loading states, visual feedback</li>
                                <li className="pl-2">Performance boost: smarter caching and faster repeated analyses</li>
                                <li className="pl-2">Bug hunting & stability improvements</li>
                            </ul>
                        </div>
                    </section>

                    {/* Future */}
                    <section className="mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-pink-500 flex items-center gap-4 justify-center md:justify-start">
                            <span className="text-6xl">🚀</span> Coming 2026 & Beyond
                        </h2>
                        <div className="space-y-16">
                            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-3xl p-8 border border-pink-500/30">
                                <h3 className="text-3xl font-bold mb-5 text-pink-300">Multi-Platform Expansion</h3>
                                <p className="text-gray-200 mb-4 text-lg leading-relaxed">
                                    TikTok (official Discovery API + trends/metadata), Instagram Reels (Graph API analytics & publishing), X/Twitter (short-form video & thread support via API v2).
                                </p>
                                <p className="text-gray-400 italic text-base">
                                    Goal: True cross-platform dashboard — compare performance, spot trends, and optimize everywhere from one place.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-3xl p-8 border border-purple-500/30">
                                <h3 className="text-3xl font-bold mb-5 text-purple-300">Next-Gen AI Video Intelligence</h3>
                                <p className="text-gray-200 mb-4 text-lg leading-relaxed">
                                    Advanced multimodal models (improved Whisper, CLIP-style visual+audio understanding, emotion/sarcasm detection, key moment extraction, viral probability scoring, real-time live stream analysis).
                                </p>
                                <p className="text-gray-400 italic text-base">
                                    Leveraging 2025–2026 breakthroughs in context-aware, cross-modal AI.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
                                    <h3 className="text-2xl font-bold mb-5 text-purple-300">Creator Power Tools</h3>
                                    <ul className="space-y-4 text-gray-200">
                                        <li>• AI script writer + thumbnail generator (Flux/SD3/DALL·E)</li>
                                        <li>• Competitor benchmarking & trend prediction dashboard</li>
                                        <li>• Cross-platform scheduling & performance comparison</li>
                                        <li>• Auto-editing recommendations</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50">
                                    <h3 className="text-2xl font-bold mb-5 text-purple-300">Community & Monetization</h3>
                                    <ul className="space-y-4 text-gray-200">
                                        <li>• Expanded freemium → Pro tiers with AI credits & priority</li>
                                        <li>• User forum, feature voting & GitHub collaboration</li>
                                        <li>• Team workspaces & shared analysis</li>
                                        <li>• Potential creator affiliate & brand partnership tools</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center py-16 border-t border-gray-700/50">
                        <p className="text-3xl font-bold text-purple-300 mb-6">
                            We're building fast — the future of short-form content creation is AI-first & multi-platform.
                        </p>
                        <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                            Star the repo on GitHub, suggest features, or join the waitlist. Let's shape the next era of creator tools together. ⭐
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <a
                                href="https://github.com/hayesjl77/squigly"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-lg transition"
                            >
                                View on GitHub →
                            </a>
                            <Link
                                href="/"
                                className="inline-flex items-center px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-lg transition"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}