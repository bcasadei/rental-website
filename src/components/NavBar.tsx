'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthModal } from '@/context/AuthModalContext';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { openModal } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    // Get current user on mount
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup both the listener and the event
    return () => {
      listener.subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  };

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
      {/* Auth Button Desktop */}
      {/* {user ? (
        <button
          onClick={handleLogout}
          className='hidden md:block bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded shadow hover:cursor-pointer transition'>
          Logout
        </button>
      ) : (
        <button
          onClick={() => openModal(false)}
          className='hidden md:block bg-yellow-400 hover:bg-yellow-500  text-white font-bold py-2 px-4 rounded shadow hover:cursor-pointer transition'>
          Sign Up
        </button>
      )} */}
      <div className='hidden md:flex row-auto items-center'>
        {/* Profile Dropdown */}
        <div className='relative'>
          <button
            className='flex bg-yellow-400 hover:bg-yellow-500 text-yellow-700 mx-2 p-2.5 rounded-full shadow items-center justify-center leading-none cursor-pointer transition'
            onClick={() => setProfileMenuOpen((open) => !open)}
            aria-label='Account menu'>
            <span className='material-symbols-outlined'>person</span>
          </button>
          {profileMenuOpen && (
            <div
              ref={profileMenuRef}
              className='absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-20 py-2'>
              {user ? (
                <>
                  <Link
                    href='/account'
                    className='block px-4 py-2 text-gray-700 hover:bg-sky-100'
                    onClick={() => setProfileMenuOpen(false)}>
                    My Account
                  </Link>
                  <button
                    className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-sky-100'
                    onClick={() => {
                      handleLogout();
                      setProfileMenuOpen(false);
                    }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-sky-100'
                    onClick={() => {
                      openModal(false); // Sign Up
                      setProfileMenuOpen(false);
                    }}>
                    Sign Up
                  </button>
                  <button
                    className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-sky-100'
                    onClick={() => {
                      openModal(true); // Sign In
                      setProfileMenuOpen(false);
                    }}>
                    Sign In
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <Link href='/cart'>
          <button className='flex bg-yellow-400 hover:bg-yellow-500 text-yellow-700 mx-2 p-2.5 rounded-full shadow items-center justify-center leading-none cursor-pointer transition'>
            <span className='material-symbols-outlined'>shopping_cart</span>
          </button>
        </Link>
      </div>

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
        {user ? (
          <button
            className='bg-yellow-400 hover:bg-yellow-300 text-yellow-700 font-bold py-2 px-4 rounded shadow hover:cursor-pointer transition'
            onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            onClick={() => openModal(false)}
            className='bg-yellow-400 hover:bg-yellow-500 text-yellow-700 font-bold py-2 px-4 rounded shadow hover:cursor-pointer transition'>
            Sign Up
          </button>
        )}
        <Link href='/cart' onClick={() => setMenuOpen(false)}>
          <button className='flex items-center justify-center md:block bg-yellow-400 hover:bg-yellow-500 text-yellow-700 p-2.5 rounded-full shadow cursor-pointer leading-none transition'>
            <span className='material-symbols-outlined'>shopping_cart</span>
          </button>
        </Link>
      </nav>
    </header>
  );
}
