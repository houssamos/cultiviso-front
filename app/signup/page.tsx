// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SocialLoginButtons } from '@/components/ui/social-login-buttons';

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || "Échec de l'inscription");
      }
    } catch (err) {
      setError("Échec de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f1e4] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <Image src="/cultiviso-logo.png" alt="Cultiviso Logo" width={50} height={50} />
          <h2 className="text-2xl font-bold text-green-800 mt-4">Créer un compte</h2>
        </div>

        <form onSubmit={handleSignup} className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Prénom</label>
              <input
                type="text"
                className="mt-1 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Nom</label>
              <input
                type="text"
                className="mt-1 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">Adresse e-mail</label>
            <input
              type="email"
              className="mt-1 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@domaine.fr"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="mt-1 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >Créer un compte</button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">ou continuer avec</p>

        <SocialLoginButtons />

        <p className="text-center text-sm text-gray-600 mt-6">
          Vous avez déjà un compte ? <a href="/login" className="text-green-700 font-medium hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
