'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'Victuk5@gmail.com';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.email === ADMIN_EMAIL) {
      router.push('/admin-portal');
    } else {
      router.push('/dashboard/add-listing');
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
