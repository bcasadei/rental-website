'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      if (allowedRoles && allowedRoles.length > 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        if (!profile || !allowedRoles.includes(profile.role)) {
          router.push('/');
          return;
        }
      }
      if (isMounted) setAuthorized(true);
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [allowedRoles, router]);

  if (!authorized) {
    return <div className='text-center py-20'>Checking permissions...</div>;
  }

  return <>{children}</>;
}
// This component checks if the user is authenticated and authorized based on their role.
// If the user is not authenticated, it redirects them to the home page.
// If the user is authenticated but does not have the required role, it also redirects them to the home page.
