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

interface StarAnalysisResponse {
  image_url: string;
  message: string;
  parameters: {
    duration: number;
    period: number;
    transit_time: number;
  };
  star_id: string;
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

  // Estados para análisis de estrella
  const [starId, setStarId] = useState('');
  const [starAnalysis, setStarAnalysis] = useState<StarAnalysisResponse | null>(null);
  const [starLoading, setStarLoading] = useState(false);
  const [starError, setStarError] = useState<string | null>(null);

  // Estados para modal de ayuda
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [showInfoSection, setShowInfoSection] = useState(false);

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

  const handleStarAnalysis = async () => {
    if (!starId.trim()) {
      setStarError('Por favor ingresa un ID de estrella');
      return;
    }

    setStarLoading(true);
    setStarError(null);
    setStarAnalysis(null);

    try {
      const response = await fetch(`/api/analyze-star/${starId.trim()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar la estrella');
      }

      const data: StarAnalysisResponse = await response.json();
      setStarAnalysis(data);
    } catch (err: any) {
      setStarError(err.message || 'Lo sentimos, no encontramos curva de luz para tu estrella');
      console.error(err);
    } finally {
      setStarLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (starAnalysis?.image_url) {
      const link = document.createElement('a');
      link.href = starAnalysis.image_url;
      link.download = `curva_luz_${starAnalysis.star_id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  const fieldExplanations: Record<string, { title: string; content: string }> = {
    period: {
      title: 'Período Orbital',
      content: 'Es el "año" del exoplaneta: el tiempo que tarda en dar una vuelta completa a su estrella. Un período regular y constante es la primera gran señal de que estamos viendo un objeto en una órbita estable y no una fluctuación aleatoria.'
    },
    duration: {
      title: 'Duración del Tránsito',
      content: 'Mide cuánto tiempo dura la "mini-eclipse", es decir, el paso del planeta por delante de su estrella. Este dato, junto con el período, ayuda al modelo a entender la velocidad y la distancia orbital del planeta.'
    },
    transit_depth: {
      title: 'Profundidad del Tránsito',
      content: 'Indica cuánto disminuye el brillo de la estrella. Es la pista más directa sobre el tamaño del planeta en relación con su estrella. Una mayor profundidad sugiere un planeta más grande. Se mide en "partes por millón" (ppm).'
    },
    planet_radius: {
      title: 'Radio del Planeta',
      content: 'Es el tamaño físico del planeta, medido en comparación con la Tierra (donde la Tierra = 1). Este es uno de los resultados más importantes, ya que nos dice si es un planeta rocoso como la Tierra o un gigante gaseoso como Júpiter.'
    },
    eq_temp: {
      title: 'Temperatura de Equilibrio',
      content: 'Es la temperatura superficial estimada del planeta, asumiendo que solo es calentado por su estrella. Es el factor clave para determinar si el planeta se encuentra en la "zona habitable".'
    },
    insol_flux: {
      title: 'Flujo de Insolación',
      content: 'Mide la cantidad de energía (luz y calor) que el planeta recibe de su estrella, en comparación con la que recibe la Tierra del Sol. Un valor de 1 significa que recibe la misma cantidad de energía que la Tierra.'
    },
    stellar_eff_temp: {
      title: 'Temperatura de la Estrella',
      content: 'Es la temperatura de la superficie de la estrella anfitriona. Las estrellas más calientes tienen zonas habitables más lejanas, mientras que las estrellas más frías las tienen más cercanas.'
    },
    stellar_logg: {
      title: 'Gravedad de la Estrella',
      content: 'Ayuda a clasificar el tipo y la edad de la estrella (si es una estrella joven, una enana, una gigante, etc.). El tipo de estrella afecta cómo se ve el tránsito de un planeta.'
    },
    stellar_radius: {
      title: 'Radio de la Estrella',
      content: 'Es el tamaño físico de la estrella, medido en comparación con nuestro Sol (donde el Sol = 1). Este dato es crucial, ya que sin él no podríamos calcular el tamaño real del planeta a partir de la profundidad del tránsito.'
    },
    koi_model_snr: {
      title: 'Señal a Ruido (SNR)',
      content: 'Mide la claridad de la señal del tránsito en comparación con el "ruido" de fondo del telescopio y la estrella. Un SNR alto significa que la detección es muy clara y confiable; un SNR bajo indica que la señal es débil y podría ser solo ruido.'
    },
    koi_fpflag_nt: {
      title: '¿Señal no es tránsito?',
      content: 'Un "flag" o bandera (0 o 1) que se activa si la forma de la disminución de luz no se parece a la de un planeta (por ejemplo, tiene forma de "V" en lugar de "U"). Es una fuerte señal de que podría ser un sistema de dos estrellas.'
    },
    koi_fpflag_ss: {
      title: '¿Indica eclipse estelar?',
      content: 'Se activa si se detecta un segundo "eclipse" cuando el objeto pasa por detrás de la estrella. Esto generalmente indica que el objeto emite su propia luz (otra estrella) y no es un planeta.'
    },
    koi_fpflag_co: {
      title: '¿Centroide desplazado?',
      content: 'Se activa si el telescopio detecta que la disminución de luz no proviene exactamente de la estrella objetivo, sino de un objeto cercano. Es una señal clásica de contaminación por una estrella de fondo.'
    },
    ra: {
      title: 'Ascensión Recta (RA)',
      content: 'La coordenada celestial de la estrella, equivalente a la longitud en la Tierra. Ayuda a localizar el objeto en el cielo.'
    },
    dec: {
      title: 'Declinación (Dec)',
      content: 'La coordenada celestial de la estrella, equivalente a la latitud en la Tierra. Ayuda a localizar el objeto en el cielo.'
    }
  };

  const inputClasses = "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  const FieldLabel = ({ htmlFor, text, fieldKey, required = false }: { htmlFor: string; text: string; fieldKey: string; required?: boolean }) => (
    <div className="flex cursor-pointer items-center gap-2 mb-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-300">
        {text} {required && '*'}
      </label>
      {fieldExplanations[fieldKey] && (
        <button
          type="button"
          onClick={() => openModal(fieldExplanations[fieldKey].title, fieldExplanations[fieldKey].content)}
          className="text-purple-400 hover:text-purple-300 transition flex-shrink-0"
          title="¿Qué es esto?"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Sección Informativa sobre Exoplanetas */}
      <div className="mb-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
        <button
          onClick={() => setShowInfoSection(!showInfoSection)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">🌌 Guía de Detección de Exoplanetas</h2>
            <p className="text-gray-300 text-sm">Aprende sobre los mundos más allá de nuestro sistema solar</p>
          </div>
          <span className="text-3xl text-white">{showInfoSection ? '−' : '+'}</span>
        </button>

        {showInfoSection && (
          <div className="mt-6 space-y-4 text-gray-200">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-xl font-bold text-white mb-2">¿Qué es un Exoplaneta?</h3>
              <p className="text-sm leading-relaxed">
                Un exoplaneta es simplemente un planeta que orbita una estrella diferente a nuestro Sol.
                Cuando observamos las estrellas, a veces podemos detectar pequeñas pistas que delatan la presencia
                de estos mundos lejanos. Nuestro modelo utiliza el <span className="text-purple-300 font-semibold">"método de tránsito"</span>,
                que busca diminutas y periódicas disminuciones en el brillo de una estrella, causadas por un planeta
                que pasa por delante de ella.
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-xl font-bold text-white mb-2">¿Para qué sirve identificarlos?</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold text-green-300">🔬 Búsqueda de Vida</p>
                  <p className="ml-5">El objetivo final es encontrar planetas rocosos en la "zona habitable" de su estrella,
                    donde las condiciones podrían permitir la existencia de agua líquida y, potencialmente, vida.</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-300">🪐 Entender la Formación de Planetas</p>
                  <p className="ml-5">Estudiar la increíble diversidad de exoplanetas (gigantes gaseosos calientes, súper-Tierras, etc.)
                    nos ayuda a comprender cómo se forman y evolucionan los sistemas planetarios, incluido el nuestro.</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-300">✨ Conocer nuestro Lugar en el Universo</p>
                  <p className="ml-5">Cada exoplaneta descubierto nos da una nueva perspectiva sobre la prevalencia de planetas
                    en la galaxia y las posibilidades de que no estemos solos.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parámetros Obligatorios */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              ⭐ Parámetros Obligatorios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <FieldLabel htmlFor="period" text="Período Orbital (días)" fieldKey="period" required />
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
                <FieldLabel htmlFor="duration" text="Duración del Tránsito (horas)" fieldKey="duration" required />
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
                <FieldLabel htmlFor="transit_depth" text="Profundidad del Tránsito (ppm)" fieldKey="transit_depth" required />
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
                <FieldLabel htmlFor="planet_radius" text="Radio del Planeta (R⊕)" fieldKey="planet_radius" required />
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
                <FieldLabel htmlFor="eq_temp" text="Temperatura de Equilibrio (K)" fieldKey="eq_temp" required />
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
                <FieldLabel htmlFor="insol_flux" text="Flujo de Insolación (F⊕)" fieldKey="insol_flux" required />
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
                <FieldLabel htmlFor="stellar_eff_temp" text="Temperatura Efectiva Estelar (K)" fieldKey="stellar_eff_temp" required />
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
                <FieldLabel htmlFor="stellar_logg" text="Gravedad Estelar (log g)" fieldKey="stellar_logg" required />
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
                <FieldLabel htmlFor="stellar_radius" text="Radio Estelar (R☉)" fieldKey="stellar_radius" required />
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
                      <FieldLabel htmlFor="koi_model_snr" text="Señal a Ruido (SNR)" fieldKey="koi_model_snr" />
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
                      <FieldLabel htmlFor="koi_fpflag_nt" text="¿Señal no es tránsito? (0/1)" fieldKey="koi_fpflag_nt" />
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
                      <FieldLabel htmlFor="koi_fpflag_ss" text="¿Indica eclipse estelar? (0/1)" fieldKey="koi_fpflag_ss" />
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
                      <FieldLabel htmlFor="koi_fpflag_co" text="¿Centroide desplazado? (0/1)" fieldKey="koi_fpflag_co" />
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
                      <FieldLabel htmlFor="ra" text="Ascensión Recta (RA)" fieldKey="ra" />
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
                      <FieldLabel htmlFor="dec" text="Declinación (Dec)" fieldKey="dec" />
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

        {/* Sección de Análisis de Curva de Luz */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              ✨ ¿Te interesa saber la curva de luz de tu evento de tránsito?
            </h3>
            <p className="text-gray-300">
              Ingresa el ID de tu estrella para obtener su curva de luz
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end max-w-2xl mx-auto">
            <div className="flex-1">
              <label htmlFor="starId" className={labelClasses}>
                ID de Estrella (KIC)
              </label>
              <input
                type="text"
                id="starId"
                value={starId}
                onChange={(e) => setStarId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStarAnalysis()}
                className={inputClasses}
                placeholder="Ej: 6922244"
              />
            </div>
            <button
              onClick={handleStarAnalysis}
              disabled={starLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {starLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analizando...
                </span>
              ) : (
                '🔍 Analizar'
              )}
            </button>
          </div>

          {/* Error de análisis de estrella */}
          {starError && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg max-w-2xl mx-auto">
              <p className="text-red-200 text-center">😔 {starError}</p>
            </div>
          )}

          {/* Resultados del análisis de estrella */}
          {starAnalysis && (
            <div className="mt-6 space-y-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  📈 Curva de Luz - {starAnalysis.star_id}
                </h3>

                {/* Imagen de la curva de luz */}
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <img
                    src={starAnalysis.image_url}
                    alt={`Curva de luz de ${starAnalysis.star_id}`}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                {/* Parámetros detectados */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-gray-300 text-sm mb-1">Período</p>
                    <p className="text-xl font-bold text-white">{starAnalysis.parameters?.period?.toFixed(4)} días</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-gray-300 text-sm mb-1">Duración</p>
                    <p className="text-xl font-bold text-white">{starAnalysis.parameters?.duration.toFixed(4)} horas</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <p className="text-gray-300 text-sm mb-1">Tiempo de Tránsito</p>
                    <p className="text-xl font-bold text-white">{starAnalysis.parameters?.transit_time.toFixed(4)}</p>
                  </div>
                </div>

                {/* Botón de descarga */}
                <div className="flex justify-center">
                  <button
                    onClick={handleDownloadImage}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Descargar Imagen
                  </button>
                </div>

                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p className="text-gray-300 text-sm text-center">
                    ✅ {starAnalysis.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Explicación */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border-2 border-purple-500/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {modalContent.title}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-gray-200 leading-relaxed">{modalContent.content}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-105"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
