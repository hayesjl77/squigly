// src/components/AuthHeader.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SupabaseProvider';
import { supabaseBrowser } from '@/components/Providers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthHeader() {
    const { user } = useSession();

    const [subscription, setSubscription] = useState<any>({ status: 'free' });
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isBillingLoading, setIsBillingLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!user?.id) {
            setSubscription({ status: 'free' });
            return;
        }

        const fetchSub = async () => {
            const { data, error } = await supabaseBrowser
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!error && data) {
                setSubscription(data);
            } else {
                console.error('Subscription fetch error:', error);
                setSubscription({ status: 'free' });
            }
        };

        fetchSub();
    }, [user?.id]);

    const handleSignOut = async () => {
        try {
            const { error } = await supabaseBrowser.auth.signOut();
            if (error) throw error;
            setShowUserMenu(false);
            router.push('/');
            router.refresh();
        } catch (err) {
            console.error('Sign out error:', err);
            alert('Failed to sign out. Please try again.');
        }
    };

    const handleManageBilling = async () => {
        if (isBillingLoading) return;
        setIsBillingLoading(true);

        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to open portal');

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error('Billing portal error:', error);
            alert(error.message || 'Could not open billing settings.');
        } finally {
            setIsBillingLoading(false);
        }
    };

    return (
        <header className="border-b border-gray-800 p-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo + Title + Navigation */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <img
                            src="/images/Squigly_Logo.png"
                            alt="Squigly Logo"
                            className="h-12 w-auto drop-shadow-lg"
                        />
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
                        <Link
                            href="/roadmap"
                            className="text-xl text-purple-400 hover:text-purple-300 transition font-medium"
                        >
                            Roadmap
                        </Link>
                    </div>
                </div>

                {/* Auth / User Section */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
                            >
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                                    {user.email?.[0]?.toUpperCase() || '?'}
                                </div>
                                <span className="hidden sm:inline">{user.email || 'User'}</span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50">
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <p className="font-bold text-lg">Account</p>
                                            <p className="text-gray-400 text-sm break-all mt-1">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Your Plan</p>
                                            <p className="text-2xl font-bold capitalize mt-2">
                                                {subscription.status === 'pro'
                                                    ? 'Squigly Pro'
                                                    : subscription.status === 'starter'
                                                        ? 'Squigly Starter'
                                                        : 'Free Plan'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {subscription.status && subscription.status !== 'free' ? (
                                                <button
                                                    onClick={handleManageBilling}
                                                    disabled={isBillingLoading}
                                                    className={`w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition font-medium ${
                                                        isBillingLoading ? 'opacity-70 cursor-wait' : ''
                                                    }`}
                                                >
                                                    {isBillingLoading ? 'Opening Billing...' : 'Manage Billing'}
                                                </button>
                                            ) : (
                                                <Link
                                                    href="/pricing"
                                                    className="w-full block text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition font-medium"
                                                >
                                                    Upgrade Plan
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link href="/login" className="px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition font-medium"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}