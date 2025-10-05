# 🪐 Predictor de Exoplanetas Habitables

Una aplicación web moderna construida con **Next.js 15** y **TypeScript** que utiliza Machine Learning para predecir si un exoplaneta es candidato a ser habitable.

![Predicción de Exoplanetas](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Características

- 🎨 **Interfaz Moderna**: Diseño espacial con efectos glassmorphism y gradientes
- 📊 **13 Parámetros Obligatorios**: Datos esenciales para predicción básica
- 🔬 **10 Parámetros Opcionales**: Datos adicionales que mejoran la precisión del modelo
- 🚀 **Predicción en Tiempo Real**: Resultados instantáneos con porcentajes de confianza
- 📱 **Responsive Design**: Funciona perfectamente en móviles, tablets y desktop
- 🌐 **Sin CORS Issues**: Implementación con API Route para evitar problemas de CORS

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18 o superior
- pnpm (recomendado) o npm

### Instalación

```bash
# Clonar el repositorio (si aplica)
# cd exoplanet

# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Compilar para Producción

```bash
# Compilar
pnpm build

# Ejecutar en producción
pnpm start
```

## 📋 Parámetros del Formulario

### Parámetros Obligatorios (*)

#### 🌍 Del Planeta

| Parámetro | Nombre del Campo | Descripción | Unidad |
|-----------|-----------------|-------------|---------|
| `period` | Período Orbital | Tiempo que tarda en orbitar la estrella | días |
| `duration` | Duración del Tránsito | Tiempo que tarda en cruzar la estrella | horas |
| `transit_depth` | Profundidad del Tránsito | Disminución del brillo estelar | ppm |
| `planet_radius` | Radio del Planeta | Radio del planeta | R⊕ (radios terrestres) |
| `eq_temp` | Temperatura de Equilibrio | Temperatura esperada | Kelvin |
| `insol_flux` | Flujo de Insolación | Radiación recibida | F⊕ |

#### ⭐ De la Estrella

| Parámetro | Nombre del Campo | Descripción | Unidad |
|-----------|-----------------|-------------|---------|
| `stellar_eff_temp` | Temperatura Efectiva Estelar | Temperatura superficial | Kelvin |
| `stellar_logg` | Log g Estelar | Logaritmo de la gravedad superficial | - |
| `stellar_radius` | Radio Estelar | Radio de la estrella | R☉ (radios solares) |
| `stellar_dist` | Distancia Estelar | Distancia a la estrella | parsecs |

#### 📍 Coordenadas y Señal

| Parámetro | Nombre del Campo | Descripción | Unidad |
|-----------|-----------------|-------------|---------|
| `ra` | Ascensión Recta | Coordenada celeste | grados |
| `dec` | Declinación | Coordenada celeste | grados |
| `koi_model_snr` | SNR del Modelo KOI | Relación señal-ruido | - |

### Parámetros Opcionales (Mejoran la Precisión)

Todos los parámetros KOI son opcionales y se pueden dejar en blanco:

- `koi_impact`: Parámetro de impacto del tránsito
- `koi_duration`: Duración del tránsito KOI (horas)
- `koi_depth`: Profundidad del tránsito KOI (ppm)
- `koi_prad`: Radio del planeta KOI (R⊕)
- `koi_teq`: Temperatura de equilibrio KOI (K)
- `koi_insol`: Flujo de insolación KOI (F⊕)
- `koi_steff`: Temperatura efectiva estelar KOI (K)
- `koi_slogg`: Log g estelar KOI
- `koi_srad`: Radio estelar KOI (R☉)
- `koi_quarters`: Trimestres de observación

## 🔌 API

### Endpoint Interno (Proxy)

```
POST /api/predict
Content-Type: application/json
```

**Ejemplo de Request:**

```json
{
  "period": 8.7,
  "duration": 3.1,
  "transit_depth": 450.0,
  "planet_radius": 2.1,
  "eq_temp": 950,
  "insol_flux": 210.0,
  "stellar_eff_temp": 5750,
  "stellar_logg": 4.5,
  "stellar_radius": 1.0,
  "ra": 295.5,
  "dec": 42.1,
  "koi_model_snr": 22.0,
  "stellar_dist": 300.2
}
```

**Ejemplo de Response:**

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

### API Externa

La aplicación utiliza internamente la API de predicción de exoplanetas:

- **URL**: `https://backend-cshm.onrender.com/predict`
- **API Key**: Incluida en el servidor proxy
- **Método**: POST
- **Licencia**: Open Source

## 📊 Interpretación de Resultados

### Clasificaciones

- **Candidato**: El exoplaneta muestra características prometedoras para habitabilidad y requiere más investigación (confianza típica: 50-75%)
- **Confirmado**: El exoplaneta tiene alta probabilidad de condiciones habitables (confianza típica: 75-100%)

### Métricas Mostradas

1. **Clasificación**: Etiqueta principal (Candidato/Confirmado)
2. **Confianza**: Porcentaje de confianza del modelo en la predicción
3. **Probabilidades**: Desglose de probabilidades para cada categoría

## 🎨 Tecnologías y Diseño

### Stack Tecnológico

- **Frontend Framework**: Next.js 15.5.4 con App Router
- **UI Library**: React 19.1.0
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Despliegue**: Compatible con Vercel, Netlify, etc.

### Características de Diseño

- **Tema Espacial**: Gradiente oscuro inspirado en el cosmos
- **Glassmorphism**: Efectos de vidrio esmerilado para tarjetas
- **Animaciones**: Transiciones suaves y estados de carga animados
- **Iconos**: Emojis temáticos para mejor UX
- **Accesibilidad**: Etiquetas semánticas y contraste adecuado

## 📁 Estructura del Proyecto

```
exoplanet/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── predict/
│   │   │       └── route.ts       # API Route (proxy)
│   │   ├── favicon.ico
│   │   ├── globals.css            # Estilos globales
│   │   ├── layout.tsx             # Layout principal
│   │   └── page.tsx               # Página principal
│   └── components/
│       └── ExoplanetPredictor.tsx # Componente del formulario
├── public/                        # Archivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── README.md
└── GUIA_USO.md                   # Guía detallada de uso
```

## 🔧 Configuración

### Variables de Entorno (Opcional)

Aunque la aplicación funciona sin variables de entorno, puedes personalizarlas:

```env
# .env.local
NEXT_PUBLIC_API_URL=https://backend-cshm.onrender.com/predict
API_KEY=WXviSp$hK8
```

### Personalización

#### Cambiar Valores por Defecto

Edita `src/components/ExoplanetPredictor.tsx`:

```typescript
const [formData, setFormData] = useState<FormData>({
  period: '8.7',        // Cambia aquí
  duration: '3.1',      // Cambia aquí
  // ... más valores
});
```

#### Modificar Estilos

Los estilos están en `src/app/globals.css` y utilizan Tailwind CSS inline.

## 🐛 Solución de Problemas

### Error de CORS

Si encuentras errores de CORS, asegúrate de que las peticiones pasen por la API Route `/api/predict` y no directamente a la API externa.

### API Lenta

La API está alojada en Render con el plan gratuito, que puede entrar en "sleep mode". La primera petición puede tardar hasta 30 segundos mientras el servidor se despierta.

### Errores de Compilación

```bash
# Limpiar caché y reinstalar
rm -rf node_modules .next
pnpm install
pnpm dev
```

## 📚 Documentación Adicional

- [GUIA_USO.md](./GUIA_USO.md) - Guía detallada de uso y parámetros
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contribuciones

Esta aplicación utiliza una API open source. Si encuentras bugs o tienes sugerencias, siéntete libre de contribuir.

## 📄 Licencia

Este proyecto utiliza una API pública de código abierto.

## 🌟 Características Futuras

- [ ] Historial de predicciones
- [ ] Exportación de resultados a PDF
- [ ] Comparación entre múltiples exoplanetas
- [ ] Gráficos de visualización de datos
- [ ] Base de datos de exoplanetas conocidos
- [ ] Modo offline con cache
- [ ] Internacionalización (i18n)

## 📧 Contacto

Para consultas sobre la API o el proyecto, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para la exploración espacial** 🚀