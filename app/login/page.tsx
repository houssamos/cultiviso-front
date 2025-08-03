// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebookF } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      // Fake login logic placeholder
      if (email && password) {
        router.push('/dashboard');
      } else {
        setError('Veuillez remplir tous les champs');
      }
    } catch (err) {
      setError("Échec de la connexion");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f1e4] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <Image src="/cultiviso-logo.png" alt="Cultiviso Logo" width={50} height={50} />
          <h2 className="text-2xl font-bold text-green-800 mt-4">Connexion à Cultiviso</h2>
        </div>

        <div className="mt-6">
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
          onClick={handleLogin}
          className="mt-6 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
        >Se connecter</button>

        <p className="text-center text-sm text-gray-600 mt-4">ou continuer avec</p>

        <div className="flex justify-center gap-4 mt-4">
          <button className="border px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50">
            <FcGoogle size={20} /> Google
          </button>
          <button className="border px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50">
            <FaApple size={20} /> Apple
          </button>
          <button className="border px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50">
            <FaFacebookF size={20} className="text-blue-600" /> Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Vous n’avez pas de compte ? <a href="/signup" className="text-green-700 font-medium hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  );
}
