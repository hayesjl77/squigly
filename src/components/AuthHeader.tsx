// src/components/AuthHeader.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/components/Providers';
import { User } from '@supabase/supabase-js';

export default function AuthHeader() {
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<any>({ status: 'free' });
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isBillingLoading, setIsBillingLoading] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabaseBrowser.auth.getUser();
            setUser(data.user);

            if (data.user) {
                const { data: subData } = await supabaseBrowser
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', data.user.id)
                    .single();

                setSubscription(subData || { status: 'free' });
            }
        };

        loadUser();

        const { data: listener } = supabaseBrowser.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                const { data: subData } = await supabaseBrowser
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .single();

                setSubscription(subData || { status: 'free' });
            } else {
                setSubscription({ status: 'free' });
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await supabaseBrowser.auth.signOut();
        window.location.href = '/';
    };

    const handleManageBilling = async () => {
        if (isBillingLoading) return;

        setIsBillingLoading(true);

        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Required to send auth cookies
                // No body needed anymore → server gets user from cookie
            });

            const data = await res.json();

            if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 401) {
                    alert('Session expired. Please log out and log back in.');
                    return;
                }
                throw new Error(errorData.error || 'Failed to open billing portal');
            }

            if (!data.url) {
                throw new Error('No portal URL received');
            }

            window.location.href = data.url;
        } catch (error: any) {
            console.error('Manage Billing error:', error);
            alert(error.message || 'Could not open billing settings. Please try again.');
        } finally {
            setIsBillingLoading(false);
        }
    };

    if (!user) return null;

    const isPaidPlan = subscription.status && subscription.status !== 'free';

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
                        <a href="/" className="text-xl text-gray-300 hover:text-white transition">
                            Home
                        </a>
                        <a href="/pricing" className="text-xl text-gray-300 hover:text-white transition">
                            Pricing
                        </a>
                        <a href="/terms" className="text-xl text-gray-300 hover:text-white transition">
                            Terms
                        </a>
                        <a href="/privacy" className="text-xl text-gray-300 hover:text-white transition">
                            Privacy
                        </a>
                        <a
                            href="/roadmap"
                            className="text-xl text-purple-400 hover:text-purple-300 transition font-medium"
                        >
                            Roadmap
                        </a>
                    </div>
                </div>

                {/* User Profile Dropdown */}
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
                                    {isPaidPlan ? (
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
                                        <a
                                            href="/pricing"
                                            className="w-full block text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition font-medium"
                                        >
                                            Upgrade Plan
                                        </a>
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
            </div>
        </header>
    );
}