'use client';
import { format } from 'date-fns';

export default function BookingModal({
  open,
  onClose,
  rental,
  quantity,
  startDate,
  endDate,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  rental: any;
  quantity: number;
  startDate: Date | string | null;
  endDate: Date | string | null;
  onConfirm: () => void;
}) {
  if (!open) return null;

  // Ensure dates are Date objects
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const days =
    start && end
      ? Math.max(
          1,
          Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1
          )
        )
      : 1;
  const total = rental.price_per_day * quantity * days;

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4'>
      <div className='bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-8 relative'>
        <button
          className='absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl'
          onClick={onClose}
          aria-label='Close'>
          &times;
        </button>
        <h2 className='text-2xl font-bold mb-4 text-sky-700'>
          Booking Summary
        </h2>
        <div className='mb-2'>
          <span className='font-semibold'>Product:</span> {rental.title}
        </div>
        <div className='mb-2'>
          <span className='font-semibold'>Quantity:</span> {quantity}
        </div>
        <div className='mb-2'>
          <span className='font-semibold'>Dates:</span>{' '}
          {start ? format(start, 'yyyy-MM-dd') : ''} &rarr;{' '}
          {end ? format(end, 'yyyy-MM-dd') : ''}
        </div>
        <div className='mb-4'>
          <span className='font-semibold'>Total Days:</span> {days}
        </div>
        <div className='mb-6 text-xl font-bold text-yellow-600'>
          Total: ${total.toFixed(2)}
        </div>
        <button
          className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md transition'
          onClick={onConfirm}>
          Confirm Booking
        </button>
        <button
          className='w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-full shadow-md hover:cursor-pointer transition'
          onClick={onClose}
          aria-label='Cancel'>
          Cancel
        </button>
      </div>
    </div>
  );
}
// This component displays a booking summary modal when a user rents a product.
// It shows the selected product, quantity, rental dates, total days, and total cost.
