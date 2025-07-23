'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function EditProductsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRentals();
  }, []);

  async function fetchRentals() {
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .order('id');
    if (error) setMessage('Error loading rentals: ' + error.message);
    else setRentals(data || []);
  }

  function startEdit(rental: any) {
    setEditingId(rental.id);
    setForm({ ...rental });
    setMessage('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({});
  }

  async function handleImageUpload(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('rental-images')
      .upload(fileName, file);

    if (uploadError) {
      setMessage('Image upload failed: ' + uploadError.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('rental-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    console.log('Updating rental', form);
    const { error } = await supabase
      .from('rentals')
      .update({
        title: form.title,
        description: form.description,
        category: form.category,
        image_url: form.image_url,
        price_per_day: parseFloat(form.price_per_day),
      })
      .eq('id', editingId);

    if (error) {
      setMessage('Update failed: ' + error.message);
      console.log(error);
    } else {
      setMessage('Rental updated!');
      setEditingId(null);
      setForm({});
      fetchRentals();
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this rental?')) return;
    const { error } = await supabase.from('rentals').delete().eq('id', id);
    if (error) setMessage('Delete failed: ' + error.message);
    else {
      setMessage('Rental deleted!');
      fetchRentals();
    }
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <main className='min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
        <div className='max-w-3xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg w-full'>
          <nav className='mb-8 flex flex-wrap gap-4 justify-center'>
            <Link href='/admin'>
              <button className='bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded shadow transition'>
                Dashboard
              </button>
            </Link>
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
          </nav>
          <h1 className='text-3xl font-bold mb-6 text-sky-700 text-center'>
            Edit Products
          </h1>
          {message && (
            <div className='mb-4 text-center text-green-700'>{message}</div>
          )}
          <div className='space-y-8'>
            {rentals.map((rental) =>
              editingId === rental.id ? (
                <form
                  key={rental.id}
                  onSubmit={handleUpdate}
                  className='space-y-2 border-b pb-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <input
                      className='border rounded px-2 py-1'
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                      placeholder='Title'
                    />
                    <input
                      className='border rounded px-2 py-1'
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      required
                      placeholder='Category'
                    />
                    <input
                      className='border rounded px-2 py-1'
                      value={form.price_per_day}
                      onChange={(e) =>
                        setForm({ ...form, price_per_day: e.target.value })
                      }
                      required
                      min='0'
                      step='0.01'
                      placeholder='Price Per Day'
                      type='number'
                    />
                  </div>
                  <textarea
                    className='border rounded px-2 py-1 w-full'
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={2}
                    required
                    placeholder='Description'
                  />
                  <div>
                    <label className='block font-semibold mb-1'>
                      Image URL or Upload
                    </label>
                    <div className='flex items-center gap-2'>
                      <input
                        className='border rounded px-2 py-1 flex-1'
                        value={form.image_url}
                        onChange={(e) =>
                          setForm({ ...form, image_url: e.target.value })
                        }
                        placeholder='Image URL'
                      />
                      <input
                        type='file'
                        accept='image/*'
                        id={`image-upload-${rental.id}`}
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = await handleImageUpload(
                              e.target.files[0]
                            );
                            if (url) setForm({ ...form, image_url: url });
                          }
                        }}
                      />
                      <label htmlFor={`image-upload-${rental.id}`}>
                        <span className='inline-block bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded shadow cursor-pointer transition'>
                          Upload
                        </span>
                      </label>
                      {form.image_url && (
                        <img
                          src={form.image_url}
                          alt='Preview'
                          className='h-12 w-12 object-cover rounded'
                        />
                      )}
                    </div>
                  </div>
                  <div className='flex gap-2 mt-2'>
                    <button
                      type='submit'
                      className='bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded shadow transition'>
                      Save
                    </button>
                    <button
                      type='button'
                      onClick={cancelEdit}
                      className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded shadow transition'>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  key={rental.id}
                  className='flex flex-col md:flex-row md:items-center justify-between border-b pb-4'>
                  <div>
                    <div className='font-bold'>{rental.title}</div>
                    <div className='text-sm text-gray-600'>
                      {rental.category}
                    </div>
                    <div className='text-sm'>{rental.description}</div>
                    <div className='text-sm'>
                      Price/Day: ${rental.price_per_day}
                    </div>
                    {rental.image_url && (
                      <img
                        src={rental.image_url}
                        alt={rental.title}
                        className='mt-2 max-h-24 rounded'
                      />
                    )}
                  </div>
                  <div className='flex gap-2 mt-2 md:mt-0'>
                    <button
                      onClick={() => startEdit(rental)}
                      className='bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded shadow transition'>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rental.id)}
                      className='bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded shadow transition'>
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
