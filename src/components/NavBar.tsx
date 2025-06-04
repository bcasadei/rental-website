'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='flex justify-between items-center p-6 bg-sky-600 shadow-md relative'>
      <div className='relative w-40 h-24 md:w-44 md:h-32 lg:w-52 lg:h-36'>
        <Link href='/' className='block'>
          {/* Logo Image */}
          <Image
            src='/images/water_blaster_rentals_logo_300px.png' // Path relative to the public folder
            alt='Water Blaster Rentals Logo'
            fill
            className='h-10 w-auto object-contain'
            sizes='(max-width: 768px) 120px, 200px'
          />
        </Link>
      </div>
      {/* <h1 className='text-3xl font-bold text-white'>Water Blaster Rentals</h1> */}
      {/* Hamburger Icon */}
      <button
        className='md:hidden flex flex-col justify-center items-center w-10 h-10 z-20'
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label='Toggle navigation'>
        <span
          className={`block w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${
            menuOpen ? 'rotate-45 translate-y-2' : ''
          }`}></span>
        <span
          className={`block w-6 h-0.5 bg-white mb-1 transition-all duration-300 ${
            menuOpen ? 'opacity-0' : ''
          }`}></span>
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            menuOpen ? '-rotate-45 -translate-y-2' : ''
          }`}></span>
      </button>
      {/* Desktop Nav */}
      <nav className='hidden md:flex space-x-6 text-white font-medium'>
        <Link href='/'>Home</Link>
        <Link href='/products'>Rentals</Link>
        <Link href='/about'>How It Works</Link>
        {/* <Link href='#'>FAQs</Link> */}
        <Link href='/contact'>Contact</Link>
      </nav>
      <button className='hidden md:block bg-yellow-400 hover:bg-yellow-300 text-white font-bold py-2 px-4 rounded shadow hover:cursor-pointer transition'>
        Book Now
      </button>
      {/* Mobile Nav */}
      <nav
        className={`absolute top-full left-0 w-full bg-sky-300 flex flex-col items-center space-y-4 py-6 shadow-md md:hidden z-10 transition-all duration-300 ${
          menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-8 pointer-events-none'
        }`}>
        <Link href='/' onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href='/products' onClick={() => setMenuOpen(false)}>
          Rentals
        </Link>
        <Link href='/about' onClick={() => setMenuOpen(false)}>
          How It Works
        </Link>
        {/* <Link href='#' onClick={() => setMenuOpen(false)}>
          FAQs
        </Link> */}
        <Link href='/contact' onClick={() => setMenuOpen(false)}>
          Contact
        </Link>
        <button
          className='bg-yellow-400 hover:bg-yellow-300 text-white font-bold py-2 px-4 rounded shadow hover:cursor-pointer transition'
          onClick={() => setMenuOpen(false)}>
          Book Now
        </button>
      </nav>
    </header>
  );
}
