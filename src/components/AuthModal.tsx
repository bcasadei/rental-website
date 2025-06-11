'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuthModal } from '@/context/AuthModalContext';

export default function AuthModal() {
  const { open, showSignIn, closeModal, setShowSignIn } = useAuthModal();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!open) return null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    } // Upsert profile in the profiles table
    const user = data.user;
    if (user) {
      await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: fullName,
        // add other fields if needed
      });
    }
    setMessage('Check your email for a confirmation link!');
    setLoading(false);
    setTimeout(() => {
      closeModal();
      setEmail('');
      setFullName('');
      setPassword('');
      setMessage(null);
      router.push('/account');
    }, 1500);
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
      setTimeout(() => {
        closeModal();
        setEmail('');
        setFullName('');
        setPassword('');
        setMessage(null);
      }, 1000);
    }
    setLoading(false);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative'>
        <button
          className='absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl'
          onClick={closeModal}
          aria-label='Close'>
          &times;
        </button>
        <h1 className='text-2xl font-bold text-sky-700 mb-6 text-center'>
          {showSignIn ? 'Sign In' : 'Sign Up'}
        </h1>
        <form onSubmit={showSignIn ? handleSignIn : handleSignup}>
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
            <div className='mt-4 text-center text-sm text-red-600'>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
// This component provides a modal for user authentication (sign up/sign in) using Supabase.
// It handles both sign up and sign in flows, displaying appropriate messages and managing loading states.
// It uses the AuthModalContext to control visibility and state of the modal.
