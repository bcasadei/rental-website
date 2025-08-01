'use client';
import { Suspense } from 'react';
import CheckoutSuccessContent from './content';

export default function CheckoutSuccess() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <p>Loading...</p>
          </div>
        </div>
      }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
