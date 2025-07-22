'use client';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabaseClient';

export default function CreateRentalPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pricePerDay, setPricePerDay] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = '';
    if (imageFile) {
      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('rental-images') // your bucket name
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage('Image upload failed: ' + uploadError.message);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('rental-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('rentals').insert([
      {
        title,
        description,
        category,
        image_url: imageUrl,
        price_per_day: parseFloat(pricePerDay),
      },
    ]);

    if (error) {
      setMessage('Error creating rental: ' + error.message);
    } else {
      setMessage('Rental created!');
      setTitle('');
      setDescription('');
      setCategory('');
      setImageFile(null);
      setPricePerDay('');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <main className='min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
        <div className='max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg w-full'>
          <h1 className='text-2xl font-bold mb-6 text-sky-700 text-center'>
            Create Rental
          </h1>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block font-semibold mb-1'>Title</label>
              <input
                className='w-full border rounded px-3 py-2'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className='block font-semibold mb-1'>Description</label>
              <textarea
                className='w-full border rounded px-3 py-2'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div>
              <label className='block font-semibold mb-1'>Category</label>
              <input
                className='w-full border rounded px-3 py-2'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div>
              <label className='block font-semibold mb-1'>Image Upload</label>
              <input
                type='file'
                accept='image/*'
                id='image-upload'
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                required
              />
              <label htmlFor='image-upload' className='mr-2'>
                <span
                  className='inline-block bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded shadow cursor-pointer transition'
                  tabIndex={0}>
                  Choose Image
                </span>
              </label>
              {imageFile && (
                <span className='ml-2 text-gray-700 align-middle'>
                  {imageFile.name}
                </span>
              )}
            </div>
            <div>
              <label className='block font-semibold mb-1'>Price Per Day</label>
              <input
                type='number'
                className='w-full border rounded px-3 py-2'
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
                min='0'
                step='0.01'
              />
            </div>
            <button
              type='submit'
              className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded shadow transition cursor-pointer'>
              Create Rental
            </button>
            {message && (
              <div className='text-green-600 text-center mt-2'>{message}</div>
            )}
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
