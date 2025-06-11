'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/context/AuthModalContext';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('');
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !fullName.trim() ||
      !streetAddress.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zipCode.trim() ||
      !phone.trim() ||
      !payment.trim()
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

    // Update profile with address info (store address in profiles only)
    const { error: profileError } = await supabase.from('profiles').upsert({
      user_id: userId,
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

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => {
      const days =
        Math.max(
          1,
          Math.ceil(
            (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
              (1000 * 60 * 60 * 24) +
              1
          )
        );
      return sum + item.price_per_day * item.quantity * days;
    }, 0);

    // 1. Create the order (no address fields)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          status: 'pending',
          total_price: totalPrice,
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      setError('Order creation failed: ' + (orderError?.message || 'Unknown error'));
      setBooking(false);
      return;
    }

    // 2. Create order_items (or bookings) for each cart item (no address fields)
    const orderItems = cart.map((item) => ({
      order_id: order.id,
      rental_id: item.id,
      quantity: item.quantity,
      price: item.price_per_day,
      start_date: item.startDate,
      end_date: item.endDate,
      user_id: userId,
    }));

    const { error: itemsError } = await supabase
      .from('bookings') // or 'order_items' if you have renamed it
      .insert(orderItems);

    if (itemsError) {
      setError('Failed to save order items: ' + itemsError.message);
      setBooking(false);
      return;
    }

    setSuccess('Booking confirmed! Your water blasters will be ready for pickup.');
    clearCart();
    setBooking(false);
    // Optionally redirect after a delay
    // setTimeout(() => router.push('/'), 3000);
  };

  return (
    <main className='min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
      <form
        onSubmit={handleCheckout}
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
        <label className='block mb-2 font-medium'>Payment Details</label>
        <input
          type='text'
          className='w-full border rounded px-3 py-2 mb-4'
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          required
          placeholder='Card number (demo only)'
          disabled={!user}
        />
        {error && (
          <div className='text-center text-sm text-red-600 mb-2'>{error}</div>
        )}
        {success && (
          <div className='text-center text-sm text-green-600 mb-2'>
            {success}
          </div>
        )}
        {success ? (
          <button
            type='button'
            className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md transition'
            onClick={() => router.push('/products')}>
            Continue Shopping
          </button>
        ) : (
          <button
            type='submit'
            className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md transition'
            disabled={booking || !user}>
            {booking ? 'Processing...' : 'Confirm Booking'}
          </button>
        )}
      </form>
    </main>
  );
}