import Link from 'next/link';

export default function Footer() {
  return (
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
  );
}
