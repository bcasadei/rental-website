// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedRentals } from '@/lib/rentals';

export default async function Home() {
  const rentals = await getFeaturedRentals();

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100  font-sans'>
      <section className='text-center py-20 px-6 bg-white bg-[url("/images/hero-desktop.jpg")] bg-cover bg-center text-white'>
        <h2 className='text-5xl font-medium text-white text-shadow-lg mb-4'>
          Make a Splash This Summer!
        </h2>
        <p className='text-lg text-white mb-8'>
          Rent premium water guns for parties, events, or just plain fun.
        </p>
        <div className='space-x-4'>
          <Link href='/products'>
            <button className='bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 rounded-full shadow-md hover:cursor-pointer transition'>
              View Rentals
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className='py-16 px-6 bg-sky-70'>
        <h3 className='text-3xl font-bold text-center text-sky-600 mb-10'>
          Popular Water Blasters
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
