// src/components/AuthHeader.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SupabaseProvider'; // ← new
import { supabaseBrowser } from '@/components/Providers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ... (keep your other imports if any)

export default function AuthHeader() {
    const { user } = useSession(); // ← Now comes from server + context

    const [subscription, setSubscription] = useState<any>({ status: 'free' });
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isBillingLoading, setIsBillingLoading] = useState(false);

    const router = useRouter();

    // Only fetch subscription when user changes
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
                console.error('Sub fetch error:', error);
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
            router.refresh(); // Helps clear any stale data
        } catch (err) {
            console.error('Sign out error:', err);
            alert('Failed to sign out. Please try again.');
        }
    };

    // Your handleManageBilling remains the same...

    // JSX stays exactly as you have it — just use `user` from context instead of local state
    // Replace all `user` references that were from local state with this one

    return (
        <header className="border-b border-gray-800 p-6">
            {/* ... your full beautiful header JSX ... */}
            {user ? (
                // your logged-in menu
            ) : (
                // login/signup buttons
            )}
            {/* ... */}
        </header>
    );
}