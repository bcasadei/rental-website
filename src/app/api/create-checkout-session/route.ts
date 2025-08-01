import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Interfaces for this API route
interface CheckoutSessionRequest {
  items: any[];
  total: number;
  user_id: string;
  customer_info: {
    full_name: string;
    email: string;
    phone: string;
    street_address: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface CheckoutSessionResponse {
  sessionId?: string;
  error?: string;
  details?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<CheckoutSessionResponse>> {
  try {
    const { items, total, user_id, customer_info } = await request.json();

    console.log('Received data:', {
      itemsCount: items?.length,
      total,
      user_id,
      customer_info,
    });

    // Debug environment variables
    console.log('Environment check:');
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log(
      'STRIPE_SECRET_KEY length:',
      process.env.STRIPE_SECRET_KEY?.length
    );
    console.log(
      'STRIPE_SECRET_KEY prefix:',
      process.env.STRIPE_SECRET_KEY?.substring(0, 8)
    );

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    if (!items || items.length === 0) {
      throw new Error('No items provided');
    }

    console.log('Items to process:', items);

    // Create simplified order data for metadata (under 500 chars)
    const orderSummary = items.map((item: any) => ({
      id: item.rental_id,
      qty: item.quantity,
      days: item.days,
      price: item.price,
    }));

    console.log('Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            description: `Rental for ${item.days} days`,
            images: item.image_url ? [item.image_url] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',

      // Correct way to prefill customer information
      customer_email: customer_info?.email,

      // Optional: Collect billing address
      billing_address_collection: 'auto',

      // Optional: Collect shipping address
      shipping_address_collection: {
        allowed_countries: ['US'],
      },

      success_url: `${request.headers.get(
        'origin'
      )}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout`,
      metadata: {
        user_id: user_id,
        // Store simplified order data that fits in 500 chars
        order_summary: JSON.stringify(orderSummary),
        total_amount: total.toString(),
        customer_name: customer_info?.full_name || '',
        customer_phone: customer_info?.phone || '',
      },
    });

    console.log('Session created successfully:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Error details:', error);

    return NextResponse.json(
      {
        error: 'Error creating checkout session',
        details:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error),
      },
      { status: 500 }
    );
  }
}
