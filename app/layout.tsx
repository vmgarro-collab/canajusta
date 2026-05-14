import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CañaJusta',
  description: 'El índice ciudadano del precio de la caña en España',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CañaJusta',
  },
};

export const viewport: Viewport = {
  themeColor: '#EF9F27',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-[#1A1A1A] text-[#F5F0E8]">{children}</body>
    </html>
  );
}
