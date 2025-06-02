import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-sky-600 text-white text-center py-8'>
      <h5 className='font-bold text-lg mb-2'>© 2025 Water Blaster Rentals</h5>
      <div className='text-sm space-x-4'>
        <Link href='#'>Privacy Policy</Link>
        <Link href='#'>Terms & Conditions</Link>
        <Link href='#'>Cookie Policy</Link>
        <Link href='#'>Contact</Link>
      </div>
    </footer>
  );
}
