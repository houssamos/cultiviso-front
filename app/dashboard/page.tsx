'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { API_BASE, API_KEY } from '@/lib/api';

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [preRegistered, setPreRegistered] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [notifyStats, setNotifyStats] = useState(false);
  const [notifyMarketplace, setNotifyMarketplace] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
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
        setUser(data);
        if (data?.waitlist || data?.preRegistered) {
          setPreRegistered(true);
        }
      })
      .catch(() => {
        router.push('/login');
      });

    fetch(`${API_BASE}/v1/users/count`, {
      headers: { 'X-api-key': API_KEY || '' },
    })
      .then(res => res.json())
      .then(data => {
        const count = data?.count || data?.total || data;
        if (typeof count === 'number') {
          setUserCount(count);
        }
      })
      .catch(console.error);

    fetch(`${API_BASE}/v1/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-api-key': API_KEY || '',
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch notifications');
        }
        return res.json();
      })
      .then(data => {
        setNotifyStats(!!data?.stats);
        setNotifyMarketplace(!!data?.marketplace);
      })
      .catch(err => {
        console.error(err);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleWaitlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/v1/marketplace/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-api-key': API_KEY || '',
        },
      });
      if (res.ok) {
        setPreRegistered(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setSavingNotifications(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`${API_BASE}/v1/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-api-key': API_KEY || '',
        },
        body: JSON.stringify({
          stats: notifyStats,
          marketplace: notifyMarketplace,
        }),
      });
      if (res.ok) {
        setSaveMessage({ type: 'success', text: 'Préférences enregistrées.' });
      } else {
        setSaveMessage({ type: 'error', text: "Une erreur est survenue." });
      }
    } catch (err) {
      console.error(err);
      setSaveMessage({ type: 'error', text: "Une erreur est survenue." });
    } finally {
      setSavingNotifications(false);
    }
  };

  const firstName = user?.firstName || (user as any)?.prenom || '';

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <Button onClick={handleLogout}>Déconnexion</Button>
      </div>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Profil</h2>
        {user ? (
          <div className="space-y-1">
            <p><strong>Prénom :</strong> {firstName}</p>
            <p><strong>Nom :</strong> {user.lastName || (user as any)?.nom}</p>
            <p><strong>Email :</strong> {user.email}</p>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Préinscription</h2>
        {preRegistered ? (
          <div className="space-y-2">
            <p>
              Bonjour {firstName}! Vous serez informé(e) dès la mise en ligne de la plateforme d’échange.
            </p>
            <span className="inline-block bg-green-200 text-green-900 text-sm font-semibold px-3 py-1 rounded-full">
              early access
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Rejoignez la liste d'attente pour accéder à la plateforme dès son lancement.</p>
            <Button onClick={handleWaitlist}>Se préinscrire</Button>
          </div>
        )}
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Gamification</h2>
        <div className="flex items-center gap-2">
          <span className="inline-block bg-yellow-200 text-yellow-900 text-sm font-semibold px-3 py-1 rounded-full">
            Pionnier Cultiviso
          </span>
        </div>
        {userCount !== null && (
          <p className="mt-2 text-sm text-gray-700">
            Vous faites partie des {userCount} premiers membres !
          </p>
        )}
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifyStats}
              onChange={e => setNotifyStats(e.target.checked)}
            />
            <span>Nouvelles statistiques</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifyMarketplace}
              onChange={e => setNotifyMarketplace(e.target.checked)}
            />
            <span>Lancement du marketplace</span>
          </label>
          <Button onClick={handleSaveNotifications} disabled={savingNotifications}>
            {savingNotifications ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          {saveMessage && (
            <p className={saveMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}>
              {saveMessage.text}
            </p>
          )}
        </div>
      </section>

      {user && preRegistered && (
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Explorez</h2>
          <div className="flex gap-4">
            <Link
              href="/stats"
              className="flex-1 bg-green-700 text-white text-center py-2 rounded hover:bg-green-800"
            >
              Stats
            </Link>
            <Link
              href="/carte"
              className="flex-1 bg-green-700 text-white text-center py-2 rounded hover:bg-green-800"
            >
              Carte
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

