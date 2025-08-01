'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/context/AuthModalContext';
import { getStripe } from '@/lib/stripe';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { openModal } = useAuthModal();

  // Prefill profile info if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, phone, street_address, city, state, zip')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
          setStreetAddress(data.street_address || '');
          setCity(data.city || '');
          setState(data.state || '');
          setZipCode(data.zip || '');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation (removed payment field check)
    if (
      !fullName.trim() ||
      !streetAddress.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zipCode.trim() ||
      !phone.trim()
    ) {
      setError('Please fill out all fields.');
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setBooking(true);

    let userId = user?.id;

    if (!userId) {
      setError('Please create an account or sign in to complete your booking.');
      setBooking(false);
      return;
    }

    try {
      // Only update profile, don't create orders yet
      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: fullName,
        phone,
        street_address: streetAddress,
        city,
        state,
        zip: zipCode,
      });

      if (profileError) {
        setError('Failed to update profile: ' + profileError.message);
        setBooking(false);
        return;
      }

      // Prepare cart for Stripe
      const stripeItems = cart.map((item) => {
        const days = Math.max(
          1,
          Math.ceil(
            (new Date(item.endDate).getTime() -
              new Date(item.startDate).getTime()) /
              (1000 * 60 * 60 * 24) +
              1
          )
        );
        return {
          title: item.title,
          price: item.price_per_day * days,
          quantity: item.quantity,
          days: days,
          image_url: item.image_url,
          rental_id: item.id,
          start_date: item.startDate,
          end_date: item.endDate,
        };
      });

      const totalPrice = stripeItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create Stripe session
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     items: stripeItems,
      //     total: totalPrice,
      //     user_id: user.id,
      //     customer_info: {
      //       full_name: fullName,
      //       email: user.email, // Get from user object
      //       phone: phone,
      //       street_address: streetAddress,
      //       city: city,
      //       state: state,
      //       zip: zipCode,
      //     },
      //   }),
      // });

      // const { sessionId } = await response.json();
      // const stripe = await getStripe();

      // if (stripe) {
      //   await stripe.redirectToCheckout({ sessionId });
      // }
      // Create Stripe session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: stripeItems,
          total: totalPrice,
          user_id: user.id,
          customer_info: {
            full_name: fullName,
            email: user.email,
            phone: phone,
            street_address: streetAddress,
            city: city,
            state: state,
            zip: zipCode,
          },
        }),
      });

      // Add debugging
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = responseData;
      console.log('Session ID:', sessionId);

      if (!sessionId) {
        throw new Error('No session ID received from Stripe');
      }

      const stripe = await getStripe();

      if (stripe && sessionId) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
      setBooking(false);
    }
  };

  return (
    <main className='min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
      <form
        onSubmit={handleStripeCheckout}
        className='bg-white p-8 md:mt-6 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-sky-700 mb-6 text-center'>
          Checkout
        </h1>
        {!user && (
          <div className='mb-6 text-center'>
            <p className='mb-2'>Have an account?</p>
            <button
              type='button'
              className='bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-full shadow-md transition mb-2'
              onClick={() => openModal(true)}>
              Sign In
            </button>
            <p className='mt-4 mb-2'>New here?</p>
            <button
              type='button'
              className='bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-full shadow-md transition'
              onClick={() => openModal(false)}>
              Create Account
            </button>
            <div className='mt-4 text-gray-500 text-sm'>
              You need to sign in or create an account to complete your booking.
            </div>
          </div>
        )}

        <label className='block mb-2 font-medium'>Full Name</label>
        <input
          type='text'
          className='w-full border rounded px-3 py-2 mb-4'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={!user}
        />

        <label className='block mb-2 font-medium'>Street Address</label>
        <input
          type='text'
          className='w-full border rounded px-3 py-2 mb-4'
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          required
          disabled={!user}
        />

        <label className='block mb-2 font-medium'>City</label>
        <input
          type='text'
          className='w-full border rounded px-3 py-2 mb-4'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          disabled={!user}
        />

        <label className='block mb-2 font-medium'>State</label>
        <input
          type='text'
          className='w-full border rounded px-3 py-2 mb-4'
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
          disabled={!user}
        />

        <label className='block mb-2 font-medium'>Zip Code</label>
        <input
          type='text'
          className='w-full border rounded px-3 py-2 mb-4'
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
          disabled={!user}
        />

        <label className='block mb-2 font-medium'>Phone</label>
        <input
          type='tel'
          className='w-full border rounded px-3 py-2 mb-4'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={!user}
        />

        {/* Cart Summary */}
        <div className='mb-6 p-4 bg-gray-50 rounded'>
          <h3 className='font-medium mb-2'>Order Summary</h3>
          {cart.map((item, index) => {
            const days = Math.max(
              1,
              Math.ceil(
                (new Date(item.endDate).getTime() -
                  new Date(item.startDate).getTime()) /
                  (1000 * 60 * 60 * 24) +
                  1
              )
            );
            return (
              <div key={index} className='text-sm mb-1'>
                {item.title} x{item.quantity} ({days} days) - $
                {(item.price_per_day * days * item.quantity).toFixed(2)}
              </div>
            );
          })}
          <div className='font-bold mt-2 pt-2 border-t'>
            Total: $
            {cart
              .reduce((sum, item) => {
                const days = Math.max(
                  1,
                  Math.ceil(
                    (new Date(item.endDate).getTime() -
                      new Date(item.startDate).getTime()) /
                      (1000 * 60 * 60 * 24) +
                      1
                  )
                );
                return sum + item.price_per_day * item.quantity * days;
              }, 0)
              .toFixed(2)}
          </div>
        </div>

        {error && (
          <div className='text-center text-sm text-red-600 mb-2'>{error}</div>
        )}
        {success && (
          <div className='text-center text-sm text-green-600 mb-2'>
            {success}
          </div>
        )}

        <button
          type='submit'
          className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md transition disabled:bg-gray-400'
          disabled={booking || !user}>
          {booking ? 'Processing...' : 'Proceed to Payment'}
        </button>

        <p className='text-xs text-gray-500 mt-2 text-center'>
          You'll be redirected to Stripe for secure payment processing
        </p>
      </form>
    </main>
  );
}
