import { use } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBar } from '@/data/bares';
import { getPreciosDeBar, getPrecioCanaPromedio } from '@/data/precios';
import { getColorPorPrecioDirecto, colorClasses } from '@/lib/colors';
import { formatPrecio } from '@/lib/normalize';
import BarFichaClient from './BarFichaClient';

const BASE_URL = 'https://canajusta.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const bar = getBar(id);
  if (!bar) return {};
  const precio = getPrecioCanaPromedio(id);
  const precioStr = precio ? formatPrecio(precio) : 'sin datos';
  const title = `${bar.nombre} — Precio caña ${precioStr} | CañaJusta`;
  const description = `La caña en ${bar.nombre} (${bar.ciudad}) cuesta ${precioStr}. Consulta el histórico de precios y añade el tuyo en CañaJusta.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/bar/${id}`,
      siteName: 'CañaJusta',
    },
    twitter: { card: 'summary', title, description },
  };
}

export default function BarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const bar = getBar(id);
  if (!bar) notFound();

  const precios = getPreciosDeBar(id);
  const promedioCana = getPrecioCanaPromedio(id);
  const color = promedioCana ? getColorPorPrecioDirecto(promedioCana, 'caña') : 'ambar';
  const colors = colorClasses[color];

  // Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: bar.nombre,
    address: {
      '@type': 'PostalAddress',
      streetAddress: bar.direccion,
      addressLocality: bar.ciudad,
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: bar.lat,
      longitude: bar.lng,
    },
    ...(promedioCana && {
      priceRange: formatPrecio(promedioCana),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BarFichaClient bar={bar} precios={precios} promedioCana={promedioCana} color={color} colors={colors} />
    </>
  );
}
