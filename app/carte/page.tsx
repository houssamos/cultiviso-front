'use client';

import CarteComponent from '@/components/pages/carte/CarteComponent';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CartePage() {
  return (
    <ProtectedRoute>
      <main className="h-screen">
        <CarteComponent />
      </main>
    </ProtectedRoute>
  );
}
