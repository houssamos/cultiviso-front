// 📁 components/layout/FooterNav.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, BarChart2, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/carte', label: 'Carte', icon: Map },
  { href: '/donnees', label: 'Données', icon: BarChart2 },
  { href: '/profil', label: 'Profil', icon: User },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 h-16 flex justify-around items-center text-sm z-10">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link href={href} key={href} className={`flex flex-col items-center ${isActive ? 'text-primary font-semibold' : 'text-gray-500'}`}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </footer>
  );
}
