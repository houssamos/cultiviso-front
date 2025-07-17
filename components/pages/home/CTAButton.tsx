"use client";

import { useRouter } from "next/navigation";

export default function CTAButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/carte")}
      className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-full"
    >
      Explorer les données
    </button>
  );
}

