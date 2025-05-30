// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100 text-gray-800 font-sans'>
      {/* Header */}
      <header className='flex justify-between items-center p-6 bg-sky-300 shadow-md'>
        <h1 className='text-3xl font-bold text-white'>Water Blaster Rentals</h1>
        <nav className='flex space-x-6 text-white font-medium'>
          <Link href='#'>Home</Link>
          <Link href='#'>Rentals</Link>
          <Link href='#'>How It Works</Link>
          <Link href='#'>FAQs</Link>
          <Link href='#'>Contact</Link>
        </nav>
        <button className='bg-yellow-400 hover:bg-yellow-300 text-white font-bold py-2 px-4 rounded shadow'>
          Book Now
        </button>
      </header>

      {/* Hero Section */}
      <section className='text-center py-20 bg-white'>
        <h2 className='text-5xl font-extrabold text-sky-500 mb-4'>
          Make a Splash This Summer!
        </h2>
        <p className='text-lg text-gray-600 mb-8'>
          Rent premium water guns for parties, events, or just plain fun.
        </p>
        <div className='space-x-4'>
          <button className='bg-coral-500 hover:bg-coral-400 text-white font-bold py-3 px-6 rounded-full shadow-md'>
            View Rentals
          </button>
          <button className='bg-yellow-400 hover:bg-yellow-300 text-white font-bold py-3 px-6 rounded-full shadow-md'>
            Reserve Now
          </button>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className='py-16 px-6 bg-sky-50'>
        <h3 className='text-3xl font-bold text-center text-sky-600 mb-10'>
          Popular Water Blasters
        </h3>
        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {['Blaster 1', 'Blaster 2', 'Blaster 3'].map((item, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition'>
              <div className='h-48 bg-gray-200 mb-4 rounded'>
                Image Placeholder
              </div>
              <h4 className='text-xl font-semibold mb-2'>{item}</h4>
              <p className='text-gray-600 mb-4'>
                High-capacity, long-range, perfect for all ages.
              </p>
              <button className='bg-sky-400 hover:bg-sky-300 text-white py-2 px-4 rounded-full font-bold'>
                Rent Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-sky-300 text-white text-center py-8 mt-16'>
        <h5 className='font-bold text-lg mb-2'>© 2025 Water Blaster Rentals</h5>
        <div className='text-sm space-x-4'>
          <Link href='#'>Privacy Policy</Link>
          <Link href='#'>Terms & Conditions</Link>
          <Link href='#'>Cookie Policy</Link>
          <Link href='#'>Contact</Link>
        </div>
      </footer>
    </main>
  );
}
