# CañaJusta

El índice ciudadano del precio de la caña en España. Empezando por Alcorcón.

## Requisitos

- Node.js 18+
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Build de producción

```bash
npm run build
npm start
```

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Leaflet + OpenStreetMap
- lucide-react
- next-pwa

## Estructura

- `app/` — Rutas de la app (6 pantallas)
- `components/` — Componentes reutilizables
- `data/` — Datos mockeados de bares y precios
- `lib/` — Lógica de colores y normalización de precios

## Despliegue

Conecta el repositorio a [Vercel](https://vercel.com) y se despliega automáticamente con cada push.
