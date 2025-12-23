// src/components/SupabaseProvider.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/components/Providers';

interface SessionContextType {
    session: Session | null;
    user: User | null;
}

const SessionContext = createContext<SessionContextType>({
    session: null,
    user: null,
});

export function SupabaseProvider({
                                     children,
                                     initialSession,
                                 }: {
    children: ReactNode;
    initialSession: Session | null;
}) {
    const [session, setSession] = useState<Session | null>(initialSession);

    useEffect(() => {
        const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const user = session?.user ?? null;

    return (
        <SessionContext.Provider value={{ session, user }}>
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