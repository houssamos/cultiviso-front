'use client';

import { useEffect, useState } from 'react';
import AdminRoute from '@/components/auth/AdminRoute';
import { API_BASE, API_KEY } from '@/lib/api';
import { Button } from '@/components/ui/button';

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
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendStats, setSendStats] = useState(false);
  const [sendMarketplace, setSendMarketplace] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleSend = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setMessage({ type: 'error', text: "Vous devez être connecté." });
      return;
    }
    if (!sendStats && !sendMarketplace) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner au moins un public.' });
      return;
    }

    setSending(true);
    setMessage(null);
    try {
      const params = new URLSearchParams();
      if (sendStats) params.append('stats', 'true');
      if (sendMarketplace) params.append('marketplace', 'true');
      const res = await fetch(`${API_BASE}/v1/notifications/admin/send?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-api-key': API_KEY || '',
        },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setMessage({ type: 'success', text: data?.message || 'Email envoyé.' });
        setSubject('');
        setBody('');
        setSendStats(false);
        setSendMarketplace(false);
      } else {
        setMessage({ type: 'error', text: data?.message || "Échec de l'envoi." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "Échec de l'envoi." });
    } finally {
      setSending(false);
    }
  };

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
        <div className="mt-8 space-y-4 max-w-2xl">
          <h2 className="text-xl font-bold">Envoyer une notification</h2>
          <div className="space-y-2">
            <label className="block text-sm">Sujet</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Sujet du mail"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Message</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full border p-2 rounded h-40"
              placeholder="Contenu du mail"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sendStats}
                onChange={e => setSendStats(e.target.checked)}
              />
              <span>Stats</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sendMarketplace}
                onChange={e => setSendMarketplace(e.target.checked)}
              />
              <span>Marketplace</span>
            </label>
          </div>
          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
          <Button
            onClick={handleSend}
            disabled={sending}
            className="bg-green-700 text-white hover:bg-green-800"
          >
            {sending ? 'Envoi...' : 'Envoyer'}
          </Button>
        </div>
      </div>
    </AdminRoute>
  );
}
