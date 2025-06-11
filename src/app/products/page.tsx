import Image from 'next/image';
import Link from 'next/link';
import { getRentals } from '@/lib/rentals';

export default async function Products() {
  const rentals = await getRentals();

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100  font-sans'>
      <section className='py-16 px-6 bg-sky-70'>
        <h3 className='text-3xl font-bold text-center text-sky-600 mb-10'>
          Water Blasters
        </h3>
        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {rentals?.map((item: any) => (
            <div
              key={item.id}
              className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition'>
              <div className='h-58 bg-gray-100 mb-4 rounded flex items-center justify-center overflow-hidden'>
                <Link href={`/products/${item.id}`}>
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      width={250}
                      height={192}
                      className='object-contain w-full h-full'
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </Link>
              </div>
              <h4 className='text-xl font-semibold mb-2'>{item.title}</h4>
              <p className='text-gray-600 mb-4'>{item.description}</p>
              <Link href={`/products/${item.id}`}>
                <button className='bg-sky-600 hover:bg-sky-500 text-white py-2 px-4 rounded-full font-bold hover:cursor-pointer transition'>
                  Rent Now
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
