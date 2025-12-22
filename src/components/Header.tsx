// src/components/Header.tsx
'use client';

import { useState } from 'react';
// Import any other dependencies your header needs (User type, supabase, etc.)
// If the header needs user/subscription data, you'll need to pass them as props
// or use a context/provider higher up

interface HeaderProps {
    user?: any;          // adjust type as needed
    subscription?: any;
    // add other props your user menu needs
}

export default function Header({ user, subscription }: HeaderProps) {
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSignOut = async () => {
        // your sign out logic here
    };

    return (
        <header className="border-b border-gray-800 p-6 bg-gradient-to-b from-[#0f172a] to-black text-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
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

                    <nav className="flex items-center gap-6">
                        <a href="/pricing" className="text-xl text-gray-300 hover:text-white transition">Pricing</a>
                        <a href="/terms" className="text-xl text-gray-300 hover:text-white transition">Terms</a>
                        <a href="/privacy" className="text-xl text-gray-300 hover:text-white transition">Privacy</a>
                        <a href="/roadmap" className="text-xl text-purple-400 hover:text-purple-300 transition font-medium">
                            Roadmap
                        </a>
                    </nav>
                </div>

                {/* User profile menu - copy your existing logic here */}
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
                        >
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                                {user?.email?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span>{user?.email || 'Loading...'}</span>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50">
                                {/* Your dropdown content: account info, plan, manage billing, sign out */}
                                {/* Copy-paste from your current page.tsx */}
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </header>
    );
}