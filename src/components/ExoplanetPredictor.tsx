'use client';

import { useState } from 'react';

interface PredictionResponse {
  confidence: string;
  predicted_label: string;
  probabilities: {
    Candidato: string;
    Confirmado: string;
  };
}

interface FormData {
  // Campos obligatorios (9)
  period: string;
  duration: string;
  transit_depth: string;
  planet_radius: string;
  eq_temp: string;
  insol_flux: string;
  stellar_eff_temp: string;
  stellar_logg: string;
  stellar_radius: string;

  // Campos opcionales recomendados (6)
  koi_model_snr?: string;
  koi_fpflag_nt?: string;
  koi_fpflag_ss?: string;
  koi_fpflag_co?: string;
  ra?: string;
  dec?: string;
}

export default function ExoplanetPredictor() {
  const [formData, setFormData] = useState<FormData>({
    // Solo valores por defecto para campos obligatorios
    period: '8.7',
    duration: '3.1',
    transit_depth: '450.0',
    planet_radius: '2.1',
    eq_temp: '950',
    insol_flux: '210.0',
    stellar_eff_temp: '5750',
    stellar_logg: '4.5',
    stellar_radius: '1.0',
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Preparar datos para enviar (convertir strings a números y filtrar vacíos)
      const dataToSend: any = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value !== '') {
          dataToSend[key] = parseFloat(value);
        }
      });

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Error en la predicción');
      }

      const data: PredictionResponse = await response.json();
      setPrediction(data);
    } catch (err) {
      setError('Error al realizar la predicción. Por favor intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parámetros Obligatorios */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              ⭐ Parámetros Obligatorios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="period" className={labelClasses}>
                  Período Orbital (días) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="8.7"
                />
              </div>

              <div>
                <label htmlFor="duration" className={labelClasses}>
                  Duración del Tránsito (horas) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="3.1"
                />
              </div>

              <div>
                <label htmlFor="transit_depth" className={labelClasses}>
                  Profundidad del Tránsito (ppm) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="transit_depth"
                  name="transit_depth"
                  value={formData.transit_depth}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="450.0"
                />
              </div>

              <div>
                <label htmlFor="planet_radius" className={labelClasses}>
                  Radio del Planeta (R⊕) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="planet_radius"
                  name="planet_radius"
                  value={formData.planet_radius}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="2.1"
                />
              </div>

              <div>
                <label htmlFor="eq_temp" className={labelClasses}>
                  Temperatura de Equilibrio (K) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="eq_temp"
                  name="eq_temp"
                  value={formData.eq_temp}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="950"
                />
              </div>

              <div>
                <label htmlFor="insol_flux" className={labelClasses}>
                  Flujo de Insolación (F⊕) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="insol_flux"
                  name="insol_flux"
                  value={formData.insol_flux}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="210.0"
                />
              </div>

              <div>
                <label htmlFor="stellar_eff_temp" className={labelClasses}>
                  Temperatura Efectiva Estelar (K) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="stellar_eff_temp"
                  name="stellar_eff_temp"
                  value={formData.stellar_eff_temp}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="5750"
                />
              </div>

              <div>
                <label htmlFor="stellar_logg" className={labelClasses}>
                  Gravedad Estelar (log g) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="stellar_logg"
                  name="stellar_logg"
                  value={formData.stellar_logg}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="4.5"
                />
              </div>

              <div>
                <label htmlFor="stellar_radius" className={labelClasses}>
                  Radio Estelar (R☉) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="stellar_radius"
                  name="stellar_radius"
                  value={formData.stellar_radius}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="1.0"
                />
              </div>
            </div>
          </div>

          {/* Parámetros Opcionales Recomendados */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition text-white font-medium"
            >
              <span className="flex items-center gap-2">
                🔬 Parámetros Opcionales Recomendados (Mejoran la Precisión)
              </span>
              <span className="text-2xl">{showAdvanced ? '−' : '+'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-6">
                {/* Calidad de Señal y Detección de Falsos Positivos */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">🎯 Calidad de Señal y Detección</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="koi_model_snr" className={labelClasses}>
                        Señal a Ruido (SNR)
                      </label>
                      <input
                        type="number"
                        step="any"
                        id="koi_model_snr"
                        name="koi_model_snr"
                        value={formData.koi_model_snr || ''}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Nivel de claridad de la señal"
                      />
                    </div>

                    <div>
                      <label htmlFor="koi_fpflag_nt" className={labelClasses}>
                        ¿Señal no es tránsito? (0/1)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="1"
                        id="koi_fpflag_nt"
                        name="koi_fpflag_nt"
                        value={formData.koi_fpflag_nt || ''}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Curva de luz anómala"
                      />
                    </div>

                    <div>
                      <label htmlFor="koi_fpflag_ss" className={labelClasses}>
                        ¿Indica eclipse estelar? (0/1)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="1"
                        id="koi_fpflag_ss"
                        name="koi_fpflag_ss"
                        value={formData.koi_fpflag_ss || ''}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Señal de otra estrella"
                      />
                    </div>

                    <div>
                      <label htmlFor="koi_fpflag_co" className={labelClasses}>
                        ¿Centroide desplazado? (0/1)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="1"
                        id="koi_fpflag_co"
                        name="koi_fpflag_co"
                        value={formData.koi_fpflag_co || ''}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Señal no viene del objetivo"
                      />
                    </div>
                  </div>
                </div>

                {/* Coordenadas */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">📍 Coordenadas Celestiales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ra" className={labelClasses}>
                        Ascensión Recta (RA)
                      </label>
                      <input
                        type="number"
                        step="any"
                        id="ra"
                        name="ra"
                        value={formData.ra || ''}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Longitud celestial"
                      />
                    </div>

                    <div>
                      <label htmlFor="dec" className={labelClasses}>
                        Declinación (Dec)
                      </label>
                      <input
                        type="number"
                        step="any"
                        id="dec"
                        name="dec"
                        value={formData.dec || ''}
                        onChange={handleInputChange}
                        className={inputClasses}
                        placeholder="Latitud celestial"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón de Envío */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analizando...
                </span>
              ) : (
                '🚀 Realizar Predicción'
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-200 text-center">❌ {error}</p>
          </div>
        )}

        {/* Resultados */}
        {prediction && (
          <div className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-white/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                📊 Resultados de la Predicción
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-gray-300 text-sm mb-1">Clasificación</p>
                  <p className="text-2xl font-bold text-white">{prediction.predicted_label}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-gray-300 text-sm mb-1">Confianza</p>
                  <p className="text-2xl font-bold text-green-400">{prediction.confidence}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-2 text-center">Probabilidades</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Candidato:</span>
                      <span className="text-yellow-400 font-semibold">{prediction.probabilities.Candidato}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Confirmado:</span>
                      <span className="text-blue-400 font-semibold">{prediction.probabilities.Confirmado}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <p className="text-gray-300 text-sm text-center">
                  {prediction.predicted_label === 'Candidato' 
                    ? '🌟 Este exoplaneta es un candidato prometedor para habitabilidad. Se requiere más investigación.'
                    : '✅ Este exoplaneta ha sido confirmado con alta probabilidad de condiciones habitables.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
