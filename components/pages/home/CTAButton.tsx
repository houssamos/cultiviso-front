"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CTAButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/carte")}
      className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-full"
    >
      Explorer les données
    </Button>
  );
}

