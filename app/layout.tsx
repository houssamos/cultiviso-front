'use client';

import '../styles/globals.css';
import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Header, { NAV_ITEMS } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="fr">
      <body className="bg-[#f7f1e4] text-gray-900">
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div
          className={clsx(
            'fixed inset-0 bg-[#f7f1e4] flex flex-col items-center justify-center gap-6 text-lg text-gray-800 z-40 transition-opacity duration-300',
            menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        >
          <nav className="flex flex-col items-center gap-6">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-2 mt-6">
            <Link href="/login" className="text-green-800 text-sm font-medium" onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
            <Link
              href="/signup"
              className="bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-green-800"
              onClick={() => setMenuOpen(false)}
            >
              S'inscrire
            </Link>
          </div>
        </div>
        <div className="pt-20 min-h-screen flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
