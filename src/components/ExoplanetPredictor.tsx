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
  // Parámetros obligatorios
  period: string;
  duration: string;
  transit_depth: string;
  planet_radius: string;
  eq_temp: string;
  insol_flux: string;
  stellar_eff_temp: string;
  stellar_logg: string;
  stellar_radius: string;
  ra: string;
  dec: string;
  koi_model_snr: string;
  stellar_dist: string;
  
  // Parámetros opcionales adicionales
  koi_impact?: string;
  koi_duration?: string;
  koi_depth?: string;
  koi_prad?: string;
  koi_teq?: string;
  koi_insol?: string;
  koi_steff?: string;
  koi_slogg?: string;
  koi_srad?: string;
  koi_quarters?: string;
}

export default function ExoplanetPredictor() {
  const [formData, setFormData] = useState<FormData>({
    period: '8.7',
    duration: '3.1',
    transit_depth: '450.0',
    planet_radius: '2.1',
    eq_temp: '950',
    insol_flux: '210.0',
    stellar_eff_temp: '5750',
    stellar_logg: '4.5',
    stellar_radius: '1.0',
    ra: '295.5',
    dec: '42.1',
    koi_model_snr: '22.0',
    stellar_dist: '300.2',
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
          {/* Parámetros Obligatorios del Planeta */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🌍 Parámetros del Planeta (Obligatorios)
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
            </div>
          </div>

          {/* Parámetros Obligatorios de la Estrella */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              ⭐ Parámetros de la Estrella (Obligatorios)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  Log g Estelar *
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

              <div>
                <label htmlFor="stellar_dist" className={labelClasses}>
                  Distancia Estelar (pc) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="stellar_dist"
                  name="stellar_dist"
                  value={formData.stellar_dist}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="300.2"
                />
              </div>
            </div>
          </div>

          {/* Parámetros Obligatorios de Coordenadas */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              📍 Coordenadas y Señal (Obligatorios)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ra" className={labelClasses}>
                  Ascensión Recta (grados) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="ra"
                  name="ra"
                  value={formData.ra}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="295.5"
                />
              </div>

              <div>
                <label htmlFor="dec" className={labelClasses}>
                  Declinación (grados) *
                </label>
                <input
                  type="number"
                  step="any"
                  id="dec"
                  name="dec"
                  value={formData.dec}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="42.1"
                />
              </div>

              <div>
                <label htmlFor="koi_model_snr" className={labelClasses}>
                  SNR del Modelo KOI *
                </label>
                <input
                  type="number"
                  step="any"
                  id="koi_model_snr"
                  name="koi_model_snr"
                  value={formData.koi_model_snr}
                  onChange={handleInputChange}
                  required
                  className={inputClasses}
                  placeholder="22.0"
                />
              </div>
            </div>
          </div>

          {/* Parámetros Opcionales Avanzados */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition text-white font-medium"
            >
              <span className="flex items-center gap-2">
                🔬 Parámetros Adicionales (Opcionales - Mejoran la Precisión)
              </span>
              <span className="text-2xl">{showAdvanced ? '−' : '+'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="koi_impact" className={labelClasses}>
                      Parámetro de Impacto KOI
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_impact"
                      name="koi_impact"
                      value={formData.koi_impact || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_duration" className={labelClasses}>
                      Duración KOI (horas)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_duration"
                      name="koi_duration"
                      value={formData.koi_duration || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_depth" className={labelClasses}>
                      Profundidad KOI (ppm)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_depth"
                      name="koi_depth"
                      value={formData.koi_depth || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_prad" className={labelClasses}>
                      Radio del Planeta KOI (R⊕)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_prad"
                      name="koi_prad"
                      value={formData.koi_prad || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_teq" className={labelClasses}>
                      Temperatura de Equilibrio KOI (K)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_teq"
                      name="koi_teq"
                      value={formData.koi_teq || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_insol" className={labelClasses}>
                      Flujo de Insolación KOI (F⊕)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_insol"
                      name="koi_insol"
                      value={formData.koi_insol || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_steff" className={labelClasses}>
                      Temperatura Efectiva Estelar KOI (K)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_steff"
                      name="koi_steff"
                      value={formData.koi_steff || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_slogg" className={labelClasses}>
                      Log g Estelar KOI
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_slogg"
                      name="koi_slogg"
                      value={formData.koi_slogg || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_srad" className={labelClasses}>
                      Radio Estelar KOI (R☉)
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_srad"
                      name="koi_srad"
                      value={formData.koi_srad || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label htmlFor="koi_quarters" className={labelClasses}>
                      Trimestres de Observación KOI
                    </label>
                    <input
                      type="number"
                      step="any"
                      id="koi_quarters"
                      name="koi_quarters"
                      value={formData.koi_quarters || ''}
                      onChange={handleInputChange}
                      className={inputClasses}
                      placeholder="Opcional"
                    />
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
