import { MetadataRoute } from 'next';
import { getBares } from '@/data/bares';

const BASE_URL = 'https://canajusta.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const bares = getBares();

  const barEntries: MetadataRoute.Sitemap = bares.map(bar => ({
    url: `${BASE_URL}/bar/${bar.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/mapa`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/ranking`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    ...barEntries,
  ];
}
