'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token && user) {
      router.replace('/dashboard/restaurants');
    } else {
      router.replace('/login');
    }
  }, [user, token, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
    </div>
  );
}
