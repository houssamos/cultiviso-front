'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE, API_KEY } from '@/lib/api';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      setAuthorized(false);
      return;
    }

    fetch(`${API_BASE}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-api-key': API_KEY || '',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data?.role === 'admin' || data?.isAdmin) {
          setAuthorized(true);
        } else {
          router.push('/dashboard');
          setAuthorized(false);
        }
      })
      .catch(() => {
        router.push('/login');
        setAuthorized(false);
      });
  }, [router]);

  if (authorized === null) {
    return null;
  }

  if (!authorized) {
    return <p className="p-4">Accès refusé</p>;
  }

  return <>{children}</>;
}

