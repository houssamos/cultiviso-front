'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/signup');
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (authorized === null) {
    return null;
  }

  if (!authorized) {
    return <p className="p-4">Access denied</p>;
  }

  return <>{children}</>;
}
