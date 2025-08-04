'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebookF } from 'react-icons/fa';
import { Button } from './button';

export function SocialLoginButtons() {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button className="border px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50">
        <FcGoogle size={20} /> Google
      </Button>
      <Button className="border px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50">
        <FaApple size={20} /> Apple
      </Button>
      <Button className="border px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50">
        <FaFacebookF size={20} className="text-blue-600" /> Facebook
      </Button>
    </div>
  );
}