'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { getBares } from '@/data/bares';
import { getPrecioCanaPromedio } from '@/data/precios';
import { getColorPorPrecioDirecto } from '@/lib/colors';
import { SlidersHorizontal } from 'lucide-react';

export default function MapaPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let map: import('leaflet').Map | null = null;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current || map) return;

      map = L.map(mapRef.current, {
        center: [40.3457, -3.8285],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const bares = getBares();

      for (const bar of bares) {
        const promedio = getPrecioCanaPromedio(bar.id);
        const color = promedio ? getColorPorPrecioDirecto(promedio, 'caña') : 'ambar';
        const hex = color === 'verde' ? '#639922' : color === 'ambar' ? '#EF9F27' : '#C73E3A';

        const icon = L.divIcon({
          className: '',
          html: `<div style="width:32px;height:32px;border-radius:50%;background:${hex};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-weight:bold;font-size:13px;">🍺</span>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([bar.lat, bar.lng], { icon }).addTo(map);
        const barId = bar.id;
        marker.on('click', () => router.push(`/bar/${barId}`));

        const precioStr = promedio ? `${promedio.toFixed(2).replace('.', ',')}€` : 'Sin datos';
        marker.bindTooltip(`<strong>${bar.nombre}</strong><br>Caña: ${precioStr}`, {
          className: 'custom-tooltip',
          offset: [0, -8],
        });
      }
    }

    initMap();

    return () => {
      map?.remove();
    };
  }, [router]);

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1A]">
      <header className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#D3D1C7]/20 z-10">
        <h1 className="text-[#F5F0E8] font-bold text-lg">Alcorcón</h1>
        <button className="flex items-center gap-1.5 text-[#D3D1C7] text-sm border border-[#D3D1C7]/30 rounded-lg px-3 py-1.5">
          <SlidersHorizontal size={14} />
          Filtros
        </button>
      </header>

      <div ref={mapRef} className="flex-1 w-full" />

      <div className="absolute bottom-20 left-4 right-4 bg-[#F5F0E8] rounded-xl px-4 py-2 flex items-center justify-around text-sm z-10 shadow-lg">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#639922]" />
          <span className="text-[#1A1A1A]">Justo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EF9F27]" />
          <span className="text-[#1A1A1A]">Medio</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#C73E3A]" />
          <span className="text-[#1A1A1A]">Cañazo</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
