'use client';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ name: '', email: '', message: '' });
    setStatus('sent');
  };

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-200 to-yellow-100 font-sans'>
      <section className='py-16 px-6 bg-sky-70'>
        <h3 className='text-3xl font-bold text-center text-sky-600 mb-10'>Contact</h3>
        <form onSubmit={handleSubmit} className='max-w-lg mx-auto bg-white p-8 rounded shadow space-y-6'>
          <input
            className='w-full border p-2 rounded'
            type='text'
            name='name'
            placeholder='Your Name'
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className='w-full border p-2 rounded'
            type='email'
            name='email'
            placeholder='Your Email'
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            className='w-full border p-2 rounded'
            name='message'
            placeholder='Your Message'
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />
          <button
            className='bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded shadow transition'
            type='submit'
          >
            Send
          </button>
          {status === 'sent' && (
            <>
              <p className='text-green-600'>Message sent!</p>
              <p className='text-red-600'>Note: this is not a monitored inbox.</p>
            </>
          )}
        </form>
      </section>
    </main>
  );
}