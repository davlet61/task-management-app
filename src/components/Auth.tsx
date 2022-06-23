import supabase from '@lib/supabaseConfig';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });

      if (error) {
        throw new Error(error.message);
      }
      // eslint-disable-next-line no-alert
      alert('Check your email for the login link!');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <section className="flex flex-col items-center justify-center gap-2 p-8 bg-slate-500 rounded-md">
      <h1 className="font-bold text-white">Task Management App</h1>
      <p className="text-gray-100">Sign in via magic link</p>
      <form>
        <input
          className="p-2 outline-2 focus:outline  focus:outline-red-600 rounded-md placeholder:italic"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>
      <button
        type="button"
        onClick={handleLogin}
        className="btn-red m-1"
        disabled={loading}
      >
        <span>{loading ? 'Loading' : 'Send magic link'}</span>
      </button>
      <button
        type="button"
        onClick={handleBack}
        className="btn-red-outline"
        disabled={loading}
      >
        Back
      </button>
    </section>
  );
};

export default Auth;
