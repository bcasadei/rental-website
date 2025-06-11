'use client';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminDashboard() {
  return (
    <main className='min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
      <div className='max-w-2xl mx-auto sm:mt-6 p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-8 text-sky-700 text-center'>
          Admin Dashboard
        </h1>
        <div className='grid grid-cols-1 gap-6'>
          <Link href='/admin/orders'>
            <button className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded shadow transition cursor-pointer'>
              View Orders
            </button>
          </Link>
          <Link href='/admin/create_product'>
            <button className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded shadow transition cursor-pointer'>
              Create Product
            </button>
          </Link>
          <Link href='/admin/edit_products'>
            <button className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded shadow transition cursor-pointer'>
              Edit Products
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
