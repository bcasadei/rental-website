'use client';
import { useState } from 'react';
import Image from 'next/image';
import QuantitySelector from './QuantitySelector';
import BookingModal from './BookingModal';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function ProductDetailClient({ rental }: { rental: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleRent = (
    quantity: number,
    start: Date | null,
    end: Date | null
  ) => {
    setQty(quantity);
    setStartDate(start);
    setEndDate(end);
    setModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!startDate || !endDate) return;
    addToCart({
      id: rental.id,
      title: rental.title,
      image_url: rental.image_url,
      price_per_day: rental.price_per_day,
      quantity: qty,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    setModalOpen(false);
    router.push('/cart');
  };

  return (
    <>
      <section className='max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8'>
        <div className='flex-1 flex items-center justify-center'>
          <div className='relative w-full h-64 md:w-80 md:h-80 bg-gray-100 rounded-lg overflow-hidden'>
            {rental.image_url ? (
              <Image
                src={rental.image_url}
                alt={rental.title}
                fill
                className='object-contain'
                sizes='(max-width: 768px) 100vw, 400px'
                priority
              />
            ) : (
              <span className='text-gray-400'>No Image</span>
            )}
          </div>
        </div>
        <div className='flex-1 flex flex-col justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-sky-700 mb-2'>
              {rental.title}
            </h1>
            <span className='inline-block bg-sky-200 text-sky-700 text-xs font-semibold px-3 py-1 rounded mb-4 uppercase tracking-wide'>
              {rental.category}
            </span>
            <p className='text-gray-700 mb-6'>{rental.description}</p>
          </div>
          <div>
            <div className='text-2xl font-bold text-yellow-600 mb-4'>
              ${rental.price_per_day?.toFixed(2)}{' '}
              <span className='text-base font-normal text-gray-600'>/ day</span>
            </div>
            <QuantitySelector onRent={handleRent} />
          </div>
        </div>
      </section>
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rental={rental}
        quantity={qty}
        startDate={startDate}
        endDate={endDate}
        onConfirm={handleConfirmBooking}
      />
    </>
  );
}
