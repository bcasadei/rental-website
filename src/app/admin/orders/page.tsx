'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabaseClient';
import Modal from '@/components/Modal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      // Fetch orders with their bookings and product info
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total_price,
          created_at,
          bookings (
            id,
            quantity,
            price,
            rentals (
              title
            )
          ),
          profiles (
              full_name
          )
        `);
      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);


  const deleteOrder = async () => {
    if (!orderToDelete) return;
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderToDelete);
    if (error) {
      alert('Error deleting order: ' + error.message);
    } else {
      setOrders(orders.filter(order => order.id !== orderToDelete));
    }
    setModalOpen(false);
    setOrderToDelete(null);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <main className='min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
        <div className='max-w-5xl mx-auto sm:mt-6 p-8 bg-white rounded-lg shadow-lg w-full'>
          <nav className='mb-8 flex flex-wrap gap-4 justify-center'>
            <Link href='/admin'>
              <button className='bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded shadow transition'>
                Dashboard
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
          </nav>
          <h1 className='text-3xl font-bold mb-8 text-sky-700 text-center'>
            Orders
          </h1>
          {loading ? (
            <div className='text-center text-gray-500'>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className='text-center text-gray-500'>
              No orders to display yet.
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full border'>
                <thead>
                  <tr className='bg-sky-100'>
                    <th className='py-2 px-4 border'>Order ID</th>
                    <th className='py-2 px-4 border'>Name</th>
                    <th className='py-2 px-4 border'>Status</th>
                    <th className='py-2 px-4 border'>Created At</th>
                    <th className='py-2 px-4 border'>Products</th>
                    <th className='py-2 px-4 border'>Total Price</th>
                    <th className='py-2 px-4 border'>Edit</th>
                    <th className='py-2 px-4 border'>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className='odd:bg-gray-50 align-top'>
                      <td className='py-2 px-4 border'>{order.id}</td>
                      <td className='py-2 px-4 border'>{order.profiles?.full_name || '-'}</td>
                      <td className='py-2 px-4 border'>{order.status}</td>
                      <td className='py-2 px-4 border'>{order.created_at}</td>
                      <td className='py-2 px-4 border'>
                        <ul>
                          {order.bookings?.map((item: any) => (
                            <li key={item.id}>
                              {item.rentals?.title || 'Unknown Product'} &times; {item.quantity}
                              {item.price ? ` ($${item.price})` : ''}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className='py-2 px-4 border'>
                        {order.total_price ? `$${order.total_price}` : '-'}
                      </td>
                      <td className='py-2 px-4 border'>
                        <button className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded shadow transition cursor-pointer'>
                        Edit
                      </button></td>
                      <td className='py-2 px-4 border'>
                      <button
  onClick={() => {
    setOrderToDelete(order.id);
    setModalOpen(true);
  }}
  className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded shadow transition cursor-pointer'
>
  Delete
</button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
  <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
  <p>Are you sure you want to delete this order?</p>
  <div className="flex gap-4 mt-6 justify-end">
    <button
      className="bg-gray-300 px-4 py-2 rounded"
      onClick={() => setModalOpen(false)}
    >
      Cancel
    </button>
    <button
      className="bg-red-600 text-white px-4 py-2 rounded"
      onClick={deleteOrder}
    >
      Delete
    </button>
  </div>
</Modal>

    </ProtectedRoute>
  );
}