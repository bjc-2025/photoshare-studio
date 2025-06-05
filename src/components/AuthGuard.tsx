'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      const user = session?.user;

      // 🔒 Check if logged in and email is admin
      if (!user || user.email !== 'admin@example.com') {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <p className="text-center mt-4">Checking auth...</p>;

  return <>{children}</>;
}
