// src/app/page.tsx
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

import DashboardClient from '@/components/DashboardClient';

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Pass user.id to client component (enough for initialization)
  // Client component will handle full session + realtime updates
  return <DashboardClient initialUserId={user.id} />;
}