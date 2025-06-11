import { notFound } from 'next/navigation';
import { getRentalById } from '@/lib/rentals';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetail(props: {
  params: { productId: string };
}) {
  const { productId } = await props.params;
  const rental = await getRentalById(Number(productId));
  if (!rental) return notFound();

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100 md:pt-8 font-sans'>
      <ProductDetailClient rental={rental} />
    </main>
  );
}
// This component fetches the rental details based on the productId from the URL parameters
// and renders the ProductDetailClient component with the rental data.
