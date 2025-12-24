'use client';

import { useState, useEffect } from "react";
import { supabaseBrowser } from '@/components/Providers';
import Link from 'next/link';

export default function Pricing() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser();
            if (user) {
                const { data } = await supabaseBrowser
                    .from('subscriptions')
                    .select('status')
                    .eq('user_id', user.id)
                    .single();
                setSubscription(data || { status: 'free' });
            }
        };
        fetchSubscription();
    }, []);

    const handleCheckout = async (tier: 'starter' | 'pro' | 'test') => {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) {
            alert("Please sign in first");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, tier }),
            });
            if (!res.ok) {
                const error = await res.json();
                alert(error.error || 'Failed to start checkout');
                setLoading(false);
                return;
            }
            const { url } = await res.json();
            window.location.href = url;
        } catch (err) {
            alert("Network error — please try again");
            setLoading(false);
        }
    };

    const currentTier = subscription?.status || 'free';

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
                            <Link href="/" className="text-xl text-gray-300 hover:text-white transition">Home</Link>
                            <Link href="/pricing" className="text-xl text-purple-400 hover:text-purple-300 transition font-medium">Pricing</Link>
                            <Link href="/terms" className="text-xl text-gray-300 hover:text-white transition">Terms</Link>
                            <Link href="/privacy" className="text-xl text-gray-300 hover:text-white transition">Privacy</Link>
                            <Link href="/roadmap" className="text-xl text-gray-300 hover:text-white transition">Roadmap</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Pricing Content */}
            <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white py-20 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Choose Your Plan
                        </h1>
                        <p className="text-2xl text-gray-300">Unlock the full power of Squigly's AI coaching</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Starter Plan */}
                        <div className={`bg-gray-800/50 rounded-3xl p-10 border ${currentTier === 'starter' ? 'border-purple-500' : 'border-gray-700'} hover:border-purple-500 transition`}>
                            <h2 className="text-4xl font-bold mb-4">Squigly Starter</h2>
                            <p className="text-6xl font-extrabold mb-8">$9<span className="text-2xl font-normal text-gray-400">/month</span></p>
                            <ul className="space-y-4 mb-10 text-lg">
                                <li className="flex items-center gap-3">✓ Up to <strong>100 AI analyses/month</strong></li>
                                <li className="flex items-center gap-3">✓ Full God Mode coaching</li>
                                <li className="flex items-center gap-3">✓ Shorts & long-form insights</li>
                                <li className="flex items-center gap-3">✓ Multi-channel support</li>
                                <li className="flex items-center gap-3">✓ Fix It For Me suggestions</li>
                            </ul>
                            <button
                                onClick={() => handleCheckout('starter')}
                                disabled={loading || currentTier === 'starter'}
                                className={`w-full py-5 rounded-2xl font-bold text-xl transition ${currentTier === 'starter' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                            >
                                {loading ? 'Loading...' : currentTier === 'starter' ? 'Current Plan' : 'Choose Starter'}
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className={`bg-gradient-to-b from-purple-900/50 to-gray-800/50 rounded-3xl p-10 border-2 ${currentTier === 'pro' ? 'border-purple-500' : 'border-purple-500'} shadow-2xl shadow-purple-500/20 relative`}>
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">MOST POPULAR</div>
                            <h2 className="text-4xl font-bold mb-4">Squigly Pro</h2>
                            <p className="text-6xl font-extrabold mb-8">$29<span className="text-2xl font-normal text-gray-400">/month</span></p>
                            <ul className="space-y-4 mb-10 text-lg">
                                <li className="flex items-center gap-3">✓ Up to <strong>500 AI analyses/month</strong></li>
                                <li className="flex items-center gap-3">✓ Everything in Starter</li>
                                <li className="flex items-center gap-3">✓ Priority support</li>
                                <li className="flex items-center gap-3">✓ Advanced insights & trends</li>
                                <li className="flex items-center gap-3">✓ Early access to new features</li>
                            </ul>
                            <button
                                onClick={() => handleCheckout('pro')}
                                disabled={loading || currentTier === 'pro'}
                                className={`w-full py-5 rounded-2xl font-bold text-xl transition ${currentTier === 'pro' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'}`}
                            >
                                {loading ? 'Loading...' : currentTier === 'pro' ? 'Current Plan' : currentTier === 'starter' ? 'Upgrade to Pro' : 'Choose Pro'}
                            </button>
                        </div>
                    </div>

                    {/* TEMP TEST BUTTON - remove after test */}
                    <div className="text-center mt-16">
                        <p className="text-xl text-yellow-400 mb-4">Development Test Only (Live $1 purchase + instant refund)</p>
                        <button
                            onClick={() => handleCheckout('test')}
                            disabled={loading}
                            className="px-12 py-6 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold text-xl rounded-2xl shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Test $1 Live Purchase'}
                        </button>
                    </div>

                    <div className="text-center mt-20 text-gray-400">
                        <p>Free plan available with 1 analysis per month</p>
                        <p className="mt-4">Cancel anytime · No hidden fees</p>
                    </div>
                </div>
            </div>
        </>
    );
}