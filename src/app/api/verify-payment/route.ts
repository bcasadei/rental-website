import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        orderData: session.metadata?.order_data,
        userId: session.metadata?.user_id,
        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
      });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
