'use client';

import { useState } from 'react';
import AdminRoute from '@/components/auth/AdminRoute';
import { API_BASE, API_KEY } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function AdminNotificationsPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSend = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setMessage({ type: 'error', text: "Vous devez être connecté." });
      return;
    }

    setSending(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/v1/notifications/admin/send`, {
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
      <div className="p-4 space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Envoyer une notification</h1>
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
    </AdminRoute>
  );
}

