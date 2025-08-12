'use client';

import { useEffect, useState } from 'react';
import AdminRoute from '@/components/auth/AdminRoute';
import { API_BASE, API_KEY } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  statsSubscribed: boolean;
  marketplaceSubscribed: boolean;
  subscribed: boolean;
  subscriptionDate: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_BASE}/v1/users?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-api-key': API_KEY || '',
      },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data?.users || data.data || []);
      })
      .catch(err => console.error(err));
  }, [page, limit]);

  const hasPrev = page > 1;
  const hasNext = users.length === limit; // naive check

  return (
    <AdminRoute>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Utilisateurs</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Identité</th>
                <th className="p-2 border">Stats</th>
                <th className="p-2 border">Marketplace</th>
                <th className="p-2 border">Date d'inscription</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="text-center">
                  <td className="p-2 border">
                    {user.firstName} {user.lastName}
                    <br />
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </td>
                  <td className="p-2 border">{user.statsSubscribed ? 'Oui' : 'Non'}</td>
                  <td className="p-2 border">{user.marketplaceSubscribed ? 'Oui' : 'Non'}</td>
                  <td className="p-2 border">
                    {user.subscriptionDate ? new Date(user.subscriptionDate).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => hasPrev && setPage(page - 1)}
              disabled={!hasPrev}
            >
              Précédent
            </button>
            <span>Page {page}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => hasNext && setPage(page + 1)}
              disabled={!hasNext}
            >
              Suivant
            </button>
          </div>
          <div>
            <label htmlFor="limit" className="mr-2">Taille de page:</label>
            <select
              id="limit"
              value={limit}
              onChange={e => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border p-1 rounded"
            >
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
