'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { API_BASE, API_KEY } from '@/lib/api';

export const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  { label: 'Carte', href: '/carte' },
  { label: 'Statistiques', href: '/stats' },
  { label: 'Échanges', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'À propos', href: '#' },
];

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuthenticated(!!token);

    if (token) {
      fetch(`${API_BASE}/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-api-key': API_KEY || '',
        },
      })
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          setIsAdmin(data?.role === 'admin' || data?.isAdmin);
        })
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-[#f7f1e4]">
      <div className="flex items-center gap-3">
        <Image src="/cultiviso-logo.png" alt="Cultiviso Logo" width={40} height={40} />
        <span className="text-xl font-bold text-green-800">Cultiviso</span>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-green-800 hover:underline">
              Dashboard
            </Link>
            {isAdmin && (
              <Link href="/admin/users" className="text-sm font-medium text-green-800 hover:underline">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-800"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-green-800 hover:underline">
              Connexion
            </Link>
            <Link
              href="/signup"
              className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-800"
            >
              S'inscrire
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        {menuOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <Menu className="w-6 h-6 transition-transform duration-300" />
        )}
      </button>
    </header>
  );
}
