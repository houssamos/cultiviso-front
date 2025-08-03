'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

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
        <Link href="/login" className="text-sm font-medium text-green-800 hover:underline">Connexion</Link>
        <Link href="/signup" className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-800">S'inscrire</Link>
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
