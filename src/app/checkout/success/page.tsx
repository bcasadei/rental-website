'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderSaved, setOrderSaved] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const saveOrder = async () => {
      if (!sessionId) return;

      try {
        // Get cart data from localStorage
        const cartData = localStorage.getItem('cart');
        const cart = cartData ? JSON.parse(cartData) : [];
        console.log('Cart from localStorage:', cart);

        // Verify payment with Stripe
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const { success, userId, totalPrice } = await response.json();
        console.log('Stripe verification:', { success, userId, totalPrice });

        if (success && cart.length > 0) {
          // Create order in database
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
              {
                user_id: userId,
                status: 'pending',
                total_price: totalPrice,
                stripe_session_id: sessionId,
              },
            ])
            .select()
            .single();

          if (orderError || !order) {
            console.error('Order creation failed:', orderError);
            return;
          }

          console.log('Order created:', order);

          // Create bookings with full cart data including actual dates
          const orderItems = cart.map((item: any) => ({
            order_id: order.id,
            rental_id: item.id,
            quantity: item.quantity,
            price: item.price_per_day,
            start_date: item.startDate,
            end_date: item.endDate,
            user_id: userId,
          }));

          console.log('Creating bookings:', orderItems);

          const { error: itemsError } = await supabase
            .from('bookings')
            .insert(orderItems);

          if (itemsError) {
            console.error('Bookings creation failed:', itemsError);
          } else {
            console.log('Bookings created successfully');
            setOrderSaved(true);
            setOrderId(order.id);
            // Clear cart from localStorage
            localStorage.removeItem('cart');
          }
        } else {
          console.error('Payment verification failed or cart is empty');
        }
      } catch (error) {
        console.error('Error saving order:', error);
      }
    };

    saveOrder();
  }, [sessionId]);

  if (!orderSaved) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p>Confirming your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100 flex items-center justify-center'>
      <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center'>
        <div className='text-green-500 text-6xl mb-4'>✓</div>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Booking Confirmed!
        </h1>
        <p className='text-gray-600 mb-6'>
          Your water blasters will be ready for pickup. You'll receive a
          confirmation email shortly.
        </p>
        <p className='text-sm text-gray-500 mb-6'>Order ID: {orderId}</p>
        <div className='space-y-3'>
          <Link href='/products'>
            <button className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition'>
              Continue Shopping
            </button>
          </Link>
          <Link href='/'>
            <button className='w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition'>
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
