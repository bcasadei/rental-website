export default function Categories() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100  font-sans'>
      {/* Categories */}
      <section className='py-16 px-6 bg-sky-70'>
        <h3 className='text-3xl font-bold text-center text-sky-600 mb-10'>
          Rental Categories
        </h3>
        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {[
            'Pistol Blasters',
            'Rifle Blaster',
            'Shotgun Blasters',
            'Machine Gun Blasters',
            'Bazooka Blasters',
          ].map((item, index) => (
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
              <button className='bg-sky-600 hover:bg-sky-500 text-white py-2 px-4 rounded-full font-bold hover:cursor-pointer transition'>
                Rent Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
