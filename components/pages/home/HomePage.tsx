// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import HeroHeader from './HeroHeader';
import StatsSection from './StatsSection';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="flex flex-col min-h-screen bg-[#f7f1e4] text-gray-900">
      {/* Header with logo and menu */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-[#f7f1e4]">
        <div className="flex items-center gap-3">
          <Image
            src="/cultiviso-logo.png"
            alt="Cultiviso Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold text-green-800">Cultiviso</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link href="/">Accueil</Link>
          <Link href="/carte">Carte</Link>
          <Link href="#">Statistiques</Link>
          <Link href="#">Échanges</Link>
          <Link href="#">Contact</Link>
          <Link href="#">À propos</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-green-800 hover:underline">Connexion</Link>
          <Link href="/signup" className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-800">Créer un compte</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6 transition-transform duration-300" /> : <Menu className="w-6 h-6 transition-transform duration-300" />}
        </button>
      </header>

      {/* Mobile full-screen menu */}
      <div className={clsx(
        'fixed inset-0 bg-[#f7f1e4] flex flex-col items-center justify-center gap-6 text-lg text-gray-800 z-40 transition-opacity duration-300',
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}>
        <nav className="flex flex-col items-center gap-6">
          <Link href="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link href="/carte" onClick={() => setMenuOpen(false)}>Carte</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Statistiques</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Échanges</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>À propos</Link>
        </nav>
        <div className="flex flex-col items-center gap-2 mt-6">
          <Link href="/login" className="text-green-800 text-sm font-medium">Connexion</Link>
          <Link href="/signup" className="bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-green-800">Créer un compte</Link>
        </div>
      </div>

      <div className="pt-20">
        {/* Hero Section */}
        <HeroHeader />

        {/* Aperçu Stats */}
        <StatsSection />

        {/* Teasing plateforme */}
        <section className="bg-gold py-16 px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">🚜 Plateforme d'échange à venir</h2>
          <p className="text-gray-600 mb-6">Vendez vos récoltes, trouvez des partenaires, accédez au juste prix.</p>
          <span className="inline-block bg-green-200 text-green-900 text-sm font-semibold px-4 py-1 rounded-full">Bêta prévue été 2025</span>
        </section>

        {/* Fonctionnalités */}
        <section className="py-16 px-6 text-center">
          <h2 className="text-2xl font-bold mb-12">Pourquoi Cultiviso ?</h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold mb-2">📊 Accès open data</h3>
              <p className="text-gray-600 text-sm">Données consolidées du ministère de l’agriculture accessibles en quelques clics.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">🗺️ Visualisation interactive</h3>
              <p className="text-gray-600 text-sm">Carte et graphiques dynamiques pour tout comprendre en un clin d’œil.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">🤝 Simplicité d’utilisation</h3>
              <p className="text-gray-600 text-sm">Navigation fluide et rapide, même pour les utilisateurs non techniques.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-10 px-6">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-2">Cultiviso</h4>
              <p className="text-sm text-gray-300">Votre partenaire pour comprendre et échanger sur l’agriculture française.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Liens utiles</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li><Link href="#">À propos</Link></li>
                <li><Link href="#">Contact</Link></li>
                <li><Link href="#">Mentions légales</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Réseaux</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li><Link href="#">LinkedIn</Link></li>
                <li><Link href="#">Twitter</Link></li>
                <li><Link href="#">contact@cultiviso.fr</Link></li>
              </ul>
            </div>
          </div>
          <p className="text-center text-gray-500 text-xs mt-8">© {new Date().getFullYear()} Cultiviso. Tous droits réservés.</p>
        </footer>
      </div>
    </main>
  );
}
