# 🪐 Predictor de Exoplanetas Habitables

Una aplicación web moderna construida con Next.js que utiliza Machine Learning para predecir si un exoplaneta es candidato a ser habitable.

## 🚀 Características

- **Formulario Intuitivo**: Interfaz moderna con campos organizados por categorías
- **Parámetros Obligatorios**: 13 parámetros esenciales para la predicción básica
- **Parámetros Opcionales**: 10 parámetros adicionales que mejoran la precisión del modelo
- **Resultados en Tiempo Real**: Visualización clara de las predicciones con probabilidades
- **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y escritorio

## 📋 Parámetros del Formulario

### Parámetros Obligatorios

#### 🌍 Del Planeta
- **Período Orbital** (period): Tiempo que tarda el planeta en orbitar su estrella (días)
- **Duración del Tránsito** (duration): Tiempo que tarda el planeta en cruzar frente a su estrella (horas)
- **Profundidad del Tránsito** (transit_depth): Disminución en el brillo de la estrella durante el tránsito (ppm)
- **Radio del Planeta** (planet_radius): Radio del planeta en radios terrestres (R⊕)
- **Temperatura de Equilibrio** (eq_temp): Temperatura esperada del planeta (Kelvin)
- **Flujo de Insolación** (insol_flux): Cantidad de radiación que recibe el planeta (F⊕)

#### ⭐ De la Estrella
- **Temperatura Efectiva Estelar** (stellar_eff_temp): Temperatura de la superficie de la estrella (Kelvin)
- **Log g Estelar** (stellar_logg): Logaritmo de la gravedad superficial de la estrella
- **Radio Estelar** (stellar_radius): Radio de la estrella en radios solares (R☉)
- **Distancia Estelar** (stellar_dist): Distancia a la estrella en parsecs (pc)

#### 📍 Coordenadas y Señal
- **Ascensión Recta** (ra): Coordenada celeste (grados)
- **Declinación** (dec): Coordenada celeste (grados)
- **SNR del Modelo KOI** (koi_model_snr): Relación señal-ruido del objeto de interés de Kepler

### Parámetros Opcionales (Mejoran la Precisión)

- **koi_impact**: Parámetro de impacto del tránsito
- **koi_duration**: Duración del tránsito según KOI (horas)
- **koi_depth**: Profundidad del tránsito según KOI (ppm)
- **koi_prad**: Radio del planeta según KOI (R⊕)
- **koi_teq**: Temperatura de equilibrio según KOI (K)
- **koi_insol**: Flujo de insolación según KOI (F⊕)
- **koi_steff**: Temperatura efectiva estelar según KOI (K)
- **koi_slogg**: Log g estelar según KOI
- **koi_srad**: Radio estelar según KOI (R☉)
- **koi_quarters**: Número de trimestres de observación

## 🎯 Respuesta de la API

La API devuelve una predicción con el siguiente formato:

```json
{
  "confidence": "66.00%",
  "predicted_label": "Candidato",
  "probabilities": {
    "Candidato": "66.00%",
    "Confirmado": "34.00%"
  }
}
```

### Interpretación de Resultados

- **Candidato**: El exoplaneta muestra características prometedoras para habitabilidad y requiere más investigación
- **Confirmado**: El exoplaneta tiene alta probabilidad de condiciones habitables

## 🛠️ Instalación y Uso

### Prerrequisitos
- Node.js 18 o superior
- pnpm (o npm/yarn)

### Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Ejecutar en producción
pnpm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🔬 Tecnologías Utilizadas

- **Next.js 15.5.4**: Framework React con App Router
- **React 19.1.0**: Biblioteca UI con TypeScript
- **Tailwind CSS 4**: Framework CSS para diseño moderno
- **TypeScript**: Tipado estático para mayor seguridad

## 🌐 API

- **Endpoint**: `https://backend-cshm.onrender.com/predict`
- **Método**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `X-API-Key: WXviSp$hK8`
- **Licencia**: API Open Source

## 📊 Ejemplo de Uso

### Valores de Prueba

El formulario viene precargado con valores de ejemplo que representan un exoplaneta típico:

```javascript
{
  period: 8.7,
  duration: 3.1,
  transit_depth: 450.0,
  planet_radius: 2.1,
  eq_temp: 950,
  insol_flux: 210.0,
  stellar_eff_temp: 5750,
  stellar_logg: 4.5,
  stellar_radius: 1.0,
  ra: 295.5,
  dec: 42.1,
  koi_model_snr: 22.0,
  stellar_dist: 300.2
}
```

## 🎨 Características de Diseño

- **Tema Espacial**: Gradiente oscuro que evoca el espacio exterior
- **Diseño en Tarjetas**: Organización visual clara de los parámetros
- **Feedback Visual**: Estados de carga y resultados animados
- **Responsive**: Adaptable a todos los tamaños de pantalla
- **Glassmorphism**: Efectos modernos de vidrio esmerilado

## 🤝 Contribuciones

Este proyecto utiliza una API de código abierto. Si deseas contribuir o reportar problemas, contacta al equipo de desarrollo.

## 📝 Notas

- Todos los parámetros marcados con (*) son obligatorios
- Los parámetros opcionales pueden dejarse en blanco
- La API puede tardar unos segundos en responder dependiendo de la carga del servidor
- Los valores numéricos aceptan decimales

## 🔮 Futuras Mejoras

- Historial de predicciones
- Exportación de resultados en PDF
- Comparación entre múltiples exoplanetas
- Visualización gráfica de los parámetros
- Base de datos de exoplanetas conocidos

---

**Desarrollado con ❤️ para la exploración espacial**
