import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import supabase from '@lib/supabaseConfig';
import type { Session } from '@supabase/supabase-js';
import Account from '@components/Account';
import Auth from '@components/Auth';

const Profile: NextPage = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    // eslint-disable-next-line @typescript-eslint/no-shadow
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <main className="flex items-center justify-center h-[100vh] bg-neutral-200">
      {!session ? <Auth /> : <Account key={session.user?.id} session={session} />}
    </main>
  );
};

export default Profile;
