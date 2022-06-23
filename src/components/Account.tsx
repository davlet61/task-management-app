import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import supabase from '@lib/supabaseConfig';

interface IAccountProps {
  session: Session;
}

const Account = ({ session }: IAccountProps) => {
  const [loading, setLoading] = useState(true);
  const initialProfile = {
    id: '',
    username: '',
    website: '',
    avatarUrl: '',
  };

  const [profile, setProfile] = useState(initialProfile);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, website')
        .single();

      if (error && status !== 406) {
        throw new Error(error.message);
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        ...profile,
        id: user?.id,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">
          Email
          <input id="email" type="text" value={session.user?.email} disabled />
        </label>
      </div>
      <div>
        <label htmlFor="username">
          Name
          <input
            id="username"
            name="username"
            type="text"
            value={profile.username || ''}
            onChange={handleChange}
          />

        </label>
      </div>
      <div>
        <label htmlFor="website">
          Website
          <input
            id="website"
            name="website"
            type="website"
            value={profile.website || ''}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <button
          type="button"
          className="button block primary"
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button type="button" className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Account;
