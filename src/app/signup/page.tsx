'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  //   Redirect after successful signup/signin
  useEffect(() => {
    if (shouldRedirect) {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [shouldRedirect, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for a confirmation link!');
      setShouldRedirect(true);
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signed in successfully!');
      setShouldRedirect(true);
    }
    setLoading(false);
  };

  return (
    <main className='min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
      <form
        onSubmit={showSignIn ? handleSignIn : handleSignup}
        className='bg-white sm:mt-6 p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-sky-700 mb-6 text-center'>
          {showSignIn ? 'Sign In' : 'Sign Up'}
        </h1>
        {!showSignIn && (
          <>
            <label className='block mb-2 font-medium'>Full Name</label>
            <input
              type='text'
              className='w-full border rounded px-3 py-2 mb-4'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </>
        )}
        <label className='block mb-2 font-medium'>Email</label>
        <input
          type='email'
          className='w-full border rounded px-3 py-2 mb-4'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className='block mb-2 font-medium'>Password</label>
        <input
          type='password'
          className='w-full border rounded px-3 py-2 mb-6'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type='submit'
          className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md transition'
          disabled={loading}>
          {loading
            ? showSignIn
              ? 'Signing in...'
              : 'Signing up...'
            : showSignIn
            ? 'Sign In'
            : 'Sign Up'}
        </button>
        <div className='mt-4 text-center text-sm'>
          {showSignIn ? (
            <>
              Don't have an account?{' '}
              <button
                type='button'
                className='text-sky-600 underline'
                onClick={() => {
                  setShowSignIn(false);
                  setMessage(null);
                }}>
                Sign up.
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type='button'
                className='text-sky-600 underline'
                onClick={() => {
                  setShowSignIn(true);
                  setMessage(null);
                }}>
                Sign in.
              </button>
            </>
          )}
        </div>
        {message && (
          <div className='mt-4 text-center text-lg text-red-600'>
            {message}
            {shouldRedirect && (
              <div className='text-sky-700 mt-2'>Redirecting to home...</div>
            )}
          </div>
        )}
      </form>
    </main>
  );
}
