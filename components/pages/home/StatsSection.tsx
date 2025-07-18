import CartePreview from './CartePreview';

export default function StatsSection() {
  return (
    <section className="py-16 px-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Une vue d'ensemble du territoire</h2>
      <p className="text-gray-600 mb-8">+100 000 hectares analysés • +50 cultures référencées • Données publiques consolidées</p>
       <div className="w-full max-w-4xl h-64 mx-auto bg-gray-200 rounded-lg shadow-inner">
        <CartePreview />
      </div>
    </section>
  );
}

