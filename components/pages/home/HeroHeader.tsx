import CTAButton from "./CTAButton";
import { Button } from "@/components/ui/button";

export default function HeroHeader() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-20">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-green-800">Découvrez la nouvelle plateforme agricole française</h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-6">Statistiques. Transactions. Communauté.</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <CTAButton />
        <Button className="border border-green-700 text-green-700 font-semibold py-2 px-6 rounded-full">
          Prochaine ouverture
        </Button>
      </div>
    </section>
  );
}

