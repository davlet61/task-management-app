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
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Account key={session.user?.id} session={session} />}
    </div>
  );
};

export default Profile;
