'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/components/Providers';

interface SessionContextType {
    session: Session | null;
    user: User | null;
    isLoading: boolean;  // ← New: to handle loading state
}

const SessionContext = createContext<SessionContextType>({
    session: null,
    user: null,
    isLoading: true,
});

export function SupabaseProvider({
                                     children,
                                     initialSession,
                                 }: {
    children: ReactNode;
    initialSession: Session | null;
}) {
    const [session, setSession] = useState<Session | null>(initialSession);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Force refresh session on mount (fixes stale initialSession)
        supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        // Listen for changes
        const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, newSession) => {
            console.log('Auth state changed:', { newSession });  // ← Debug log
            setSession(newSession);
            setIsLoading(false);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const user = session?.user ?? null;

    return (
        <SessionContext.Provider value={{ session, user, isLoading }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within SupabaseProvider');
    }
    return context;
};