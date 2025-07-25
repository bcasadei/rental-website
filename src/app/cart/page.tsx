'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
// import { useAuthModal } from '@/context/AuthModalContext'; // No longer needed

function getDays(start: string, end: string) {
  return Math.max(
    1,
    Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24) +
        1
    )
  );
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  // Profile fields for booking (no longer used here, handled in checkout)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user profile if logged in (no longer required here, handled in checkout)
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     setLoadingProfile(true);
  //     setError(null);
  //     const {
  //       data: { user },
  //       error: userError,
  //     } = await supabase.auth.getUser();
  //     if (userError || !user) {
  //       setLoadingProfile(false);
  //       return;
  //     }
  //     const { data, error: profileError } = await supabase
  //       .from('profiles')
  //       .select('full_name, phone')
  //       .eq('user_id', user.id)
  //       .single();
  //     if (profileError) {
  //       setError('Could not load profile.');
  //     } else if (data) {
  //       setFullName(data.full_name || '');
  //       setPhone(data.phone || '');
  //     }
  //     setLoadingProfile(false);
  //   };
  //   fetchProfile();
  // }, []);

  const total = cart.reduce((sum, item) => {
    const days = getDays(item.startDate, item.endDate);
    return sum + item.price_per_day * item.quantity * days;
  }, 0);

  // Book Now handler (no longer used, handled in checkout)
  // const handleBookNow = async (e: React.FormEvent) => { ... }

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100 font-sans py-12'>
      <section className='max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-3xl font-bold text-sky-700 mb-8 text-center'>
          Your Booking
        </h1>
        {cart.length === 0 ? (
          <div className='text-center text-gray-500'>Your cart is empty.</div>
        ) : (
          <>
            {/* Cart items rendering */}
            {cart.map((item) => {
              const days = getDays(item.startDate, item.endDate);
              const itemTotal = item.price_per_day * item.quantity * days;
              return (
                <div
                  key={item.id}
                  className='flex gap-6 items-center border-b pb-6'>
                  <div className='relative w-32 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0'>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className='object-contain'
                      sizes='128px'
                    />
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-xl font-semibold mb-1'>{item.title}</h2>
                    <div className='text-gray-600 mb-1'>
                      <span className='font-medium'>Quantity:</span>{' '}
                      {item.quantity}
                    </div>
                    <div className='text-gray-600 mb-1'>
                      <span className='font-medium'>Dates:</span>{' '}
                      {new Date(item.startDate).toLocaleDateString()} &rarr;{' '}
                      {new Date(item.endDate).toLocaleDateString()}
                    </div>
                    <div className='text-gray-600 mb-1'>
                      <span className='font-medium'>Total Days:</span> {days}
                    </div>
                    <div className='text-yellow-600 font-bold'>
                      ${item.price_per_day} x {item.quantity} x {days} day(s) =
                      ${itemTotal.toFixed(2)}
                    </div>
                  </div>
                  <button
                    type='button'
                    className='ml-4 bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded'
                    onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              );
            })}
            <div className='flex justify-between items-center mt-8'>
              <span className='text-2xl font-bold text-sky-700'>Total:</span>
              <span className='text-2xl font-bold text-yellow-600'>
                ${total.toFixed(2)}
              </span>
            </div>
            {/* Checkout and Clear Cart buttons */}
            {/* 
              On checkout, send the user to the /checkout page where you will collect
              name, phone, and payment details, and optionally offer login/signup.
            */}
            <button
              className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md transition mt-4'
              onClick={() => (window.location.href = '/checkout')}>
              Checkout
            </button>
            <button
              type='button'
              className='w-full bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-full shadow-md transition mt-3'
              onClick={clearCart}>
              Clear Cart
            </button>
          </>
        )}
      </section>
    </main>
  );
}
