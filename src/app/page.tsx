import ExoplanetPredictor from "@/components/ExoplanetPredictor";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🪐 Predictor de Exoplanetas Habitables
          </h1>
          <p className="text-gray-300 text-lg">
            Descubre si un exoplaneta es candidato a ser habitable
          </p>
        </header>
        
        <ExoplanetPredictor />
        
        <footer className="text-center mt-12 text-gray-400 text-sm">
          <p>Powered by Machine Learning | API Open Source</p>
        </footer>
      </div>
    </div>
  );
}
