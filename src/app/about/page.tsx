export default function About() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100  font-sans'>
      <section className='py-16 px-6 bg-sky-70'>
        <h3 className='text-3xl font-bold text-center text-sky-600 mb-10'>
          How it Works
        </h3>
        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          <ol className='list-decimal list-inside'>
            <li className='text-xl font-semibold mb-5'>
              Pick Your Blasters
              <p className='text-base font-medium'>
                Browse our selection of high-powered water guns and choose your
                favorites—perfect for parties, events, or just a day of fun in
                the sun!
              </p>
            </li>
            <li className='text-xl font-semibold mb-5'>
              Choose Your Date
              <p className='text-base font-medium'>
                Select the date and duration of your rental. We offer flexible
                options, whether it’s for a few hours or the whole weekend.
              </p>
            </li>
            <li className='text-xl font-semibold mb-5'>
              We Deliver (or You Pick Up)
              <p className='text-base font-medium'>
                Get your gear delivered right to your door, or swing by and pick
                it up—it’s your call!
              </p>
            </li>
            <li className='text-xl font-semibold mb-5'>
              Make a Splash!
              <p className='text-base font-medium'>
                Unleash the fun with your friends, family, or coworkers. Our
                water blasters are cleaned, tested, and ready to soak!
              </p>
            </li>
            <li className='text-xl font-semibold mb-5'>
              Easy Return
              <p className='text-base font-medium'>
                After the fun, just return the gear or schedule a pickup. We
                handle the cleanup—no mess, no stress!
              </p>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
