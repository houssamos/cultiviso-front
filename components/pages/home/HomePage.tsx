// app/page.tsx
'use client';

import HeroHeader from './HeroHeader';
import StatsSection from './StatsSection';

export default function HomePage() {

  return (
    <main className="flex flex-col min-h-screen bg-[#f7f1e4] text-gray-900">
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

      </div>
    </main>
  );
}
