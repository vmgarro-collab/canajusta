import { MetadataRoute } from 'next';

const BASE_URL = 'https://canajusta.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/perfil', '/añadir'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
