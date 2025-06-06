'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user && isMounted) {
        router.replace('/'); // Redirect to home if not logged in
      } else if (isMounted) {
        setAuthenticated(true);
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <span>Loading...</span>
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
}
// This component checks if the user is authenticated before rendering its children.
// If the user is not authenticated, it redirects them to the home page.
