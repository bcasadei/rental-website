'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AccountPage() {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    avatar_url: '',
    street_address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setMessage('You must be signed in.');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select(
          'full_name, phone, avatar_url, street_address, city, state, zip'
        )
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        setMessage(error.message);
      }
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
          street_address: data.street_address || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Avatar upload handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage('You must be signed in.');
      setUploading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;

    // Upload to Supabase Storage (make sure you have a public 'avatars' bucket)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    const avatar_url = urlData?.publicUrl || '';

    // Update profile with new avatar_url
    setProfile((prev) => ({ ...prev, avatar_url }));
    setUploading(false);
    setMessage('Avatar uploaded! Click Save to update your profile.');
  };

  // Save profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage('You must be signed in.');
      setSaving(false);
      return;
    }
    const updates = { ...profile, user_id: user.id };
    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { onConflict: 'user_id' });
    if (error) setMessage(error.message);
    else setMessage('Profile updated!');
    setSaving(false);
  };

  return (
    <main className='min-h-screen flex items-start justify-center bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
      <form
        onSubmit={handleSave}
        className='bg-white sm:mt-6 p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-sky-700 mb-6 text-center'>
          Account Profile
        </h1>
        {loading ? (
          <div className='text-center text-gray-500'>Loading...</div>
        ) : (
          <>
            <div className='flex flex-col items-center mb-6'>
              <div className='w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2 flex items-center justify-center'>
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt='Avatar'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span className='text-gray-400'>No Avatar</span>
                )}
              </div>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                ref={fileInputRef}
                onChange={handleAvatarUpload}
              />
              <button
                type='button'
                className='bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded text-sm'
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}>
                {uploading ? 'Uploading...' : 'Change Avatar'}
              </button>
            </div>
            <label className='block mb-2 font-medium'>Full Name</label>
            <input
              name='full_name'
              type='text'
              className='w-full border rounded px-3 py-2 mb-4'
              value={profile.full_name}
              onChange={handleChange}
            />
            <label className='block mb-2 font-medium'>Phone</label>
            <input
              name='phone'
              type='text'
              className='w-full border rounded px-3 py-2 mb-4'
              value={profile.phone}
              onChange={handleChange}
            />
            <label className='block mb-2 font-medium'>Street Address</label>
            <input
              name='street_address'
              type='text'
              className='w-full border rounded px-3 py-2 mb-4'
              value={profile.street_address}
              onChange={handleChange}
            />
            <label className='block mb-2 font-medium'>City</label>
            <input
              name='city'
              type='text'
              className='w-full border rounded px-3 py-2 mb-4'
              value={profile.city}
              onChange={handleChange}
            />
            <label className='block mb-2 font-medium'>State</label>
            <input
              name='state'
              type='text'
              className='w-full border rounded px-3 py-2 mb-4'
              value={profile.state}
              onChange={handleChange}
            />
            <label className='block mb-2 font-medium'>Zip</label>
            <input
              name='zip'
              type='text'
              className='w-full border rounded px-3 py-2 mb-4'
              value={profile.zip}
              onChange={handleChange}
            />
            <button
              type='submit'
              className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md transition'
              disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            {message && (
              <div className='mt-4 text-center text-sm text-red-600'>
                {message}
              </div>
            )}
          </>
        )}
      </form>
    </main>
  );
}
// This code defines a simple account page where users can view and update their profile information.
// It includes functionality to upload an avatar image, update personal details, and save changes to the Supabase database.
