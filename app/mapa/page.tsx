'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { getBares } from '@/data/bares';
import { getPrecioCanaPromedio } from '@/data/precios';
import { getColorPorPrecioDirecto } from '@/lib/colors';
import { SlidersHorizontal, Navigation, X } from 'lucide-react';
import { formatPrecio } from '@/lib/normalize';
import { Bar } from '@/data/types';

function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const BARES_CON_PRECIO = getBares()
  .map(b => ({ bar: b, precio: getPrecioCanaPromedio(b.id) }))
  .filter(b => b.precio !== null) as { bar: Bar; precio: number }[];

const TOTAL_BARES = getBares().length;
const TOTAL_VERIFICADOS = getBares().filter(b => b.verificado).length;

export default function MapaPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [modal, setModal] = useState<{ bar: Bar; precio: number; distancia: number }[] | null>(null);
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    let map: import('leaflet').Map | null = null;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (!mapRef.current || map) return;

      map = L.map(mapRef.current, { center: [40.3457, -3.8285], zoom: 14, zoomControl: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map);

      for (const bar of getBares()) {
        const promedio = getPrecioCanaPromedio(bar.id);
        const color = promedio ? getColorPorPrecioDirecto(promedio, 'caña') : 'ambar';
        const hex = color === 'verde' ? '#639922' : color === 'ambar' ? '#EF9F27' : '#C73E3A';
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:32px;height:32px;border-radius:50%;background:${hex};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><span style="color:white;font-weight:bold;font-size:13px;">🍺</span></div>`,
          iconSize: [32, 32], iconAnchor: [16, 16],
        });
        const marker = L.marker([bar.lat, bar.lng], { icon }).addTo(map);
        const barId = bar.id;
        marker.on('click', () => router.push(`/bar/${barId}`));
        const precioStr = promedio ? `${promedio.toFixed(2).replace('.', ',')}€` : 'Sin datos';
        marker.bindTooltip(`<strong>${bar.nombre}</strong><br>Caña: ${precioStr}`, { offset: [0, -8] });
      }
    }

    initMap();
    return () => { map?.remove(); };
  }, [router]);

  function handleMasBaratos() {
    if (!navigator.geolocation) { setGeoError('Tu navegador no soporta geolocalización'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const cercanos = BARES_CON_PRECIO
          .map(b => ({ ...b, distancia: distanciaKm(latitude, longitude, b.bar.lat, b.bar.lng) }))
          .sort((a, b) => a.precio - b.precio)
          .slice(0, 3);
        setModal(cercanos);
        setGeoError('');
      },
      () => setGeoError('No se pudo obtener tu ubicación'),
    );
  }

  return (
    <div className="flex flex-col bg-[#1A1A1A]" style={{ height: '100dvh' }}>
      <header className="flex-none flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#D3D1C7]/20 z-10">
        <h1 className="text-[#F5F0E8] font-bold text-lg">Alcorcón</h1>
        <button className="flex items-center gap-1.5 text-[#D3D1C7] text-sm border border-[#D3D1C7]/30 rounded-lg px-3 py-1.5">
          <SlidersHorizontal size={14} />
          Filtros
        </button>
      </header>

      {/* Banda de métricas */}
      <div className="flex-none flex items-center justify-center gap-4 px-4 py-2 bg-[#1A1A1A] border-b border-[#D3D1C7]/10 text-xs text-[#5F5E5A]">
        <span><span className="text-[#EF9F27] font-bold">{TOTAL_BARES}</span> bares</span>
        <span className="text-[#D3D1C7]/20">·</span>
        <span><span className="text-[#EF9F27] font-bold">1</span> municipio</span>
        <span className="text-[#D3D1C7]/20">·</span>
        <span><span className="text-[#EF9F27] font-bold">{TOTAL_VERIFICADOS}</span> verificados</span>
      </div>

      {/* Mapa — ocupa el espacio entre header+banda y BottomNav */}
      <div className="relative flex-1 min-h-0">
        <div ref={mapRef} className="absolute inset-0" />

        {/* Botón "Más baratos cerca de mí" */}
        <button
          onClick={handleMasBaratos}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-[#1A1A1A] text-[#F5F0E8] text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-[#D3D1C7]/20 active:scale-95 transition-transform whitespace-nowrap"
        >
          <Navigation size={14} className="text-[#EF9F27]" />
          Más baratos cerca de mí
        </button>

        {geoError && (
          <div className="absolute top-14 left-4 right-4 z-[1000] bg-[#C73E3A]/90 text-white text-sm px-4 py-2 rounded-xl text-center">
            {geoError}
          </div>
        )}

        {/* Leyenda */}
        <div className="absolute bottom-3 left-4 right-4 bg-[#F5F0E8] rounded-xl px-4 py-2 flex items-center justify-around text-sm z-[1000] shadow-lg">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#639922]" /><span className="text-[#1A1A1A]">Justo</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#EF9F27]" /><span className="text-[#1A1A1A]">Medio</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#C73E3A]" /><span className="text-[#1A1A1A]">Cañazo</span></div>
        </div>
      </div>

      <BottomNav />

      {/* Modal "Más baratos cerca de mí" */}
      {modal && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/60" onClick={() => setModal(null)}>
          <div className="bg-[#1A1A1A] rounded-t-2xl w-full max-w-lg p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[#F5F0E8] font-bold text-lg">Los más baratos cerca</h2>
              <button onClick={() => setModal(null)}><X size={22} className="text-[#5F5E5A]" /></button>
            </div>
            <div className="space-y-3">
              {modal.map(({ bar, precio, distancia }, i) => (
                <button
                  key={bar.id}
                  onClick={() => { setModal(null); router.push(`/bar/${bar.id}`); }}
                  className="w-full flex items-center gap-4 bg-[#D3D1C7]/10 rounded-xl px-4 py-3 text-left"
                >
                  <span className="text-[#5F5E5A] font-bold w-5 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F0E8] font-medium truncate">{bar.nombre}</p>
                    <p className="text-[#5F5E5A] text-xs">{distancia < 1 ? `${Math.round(distancia * 1000)}m` : `${distancia.toFixed(1)}km`}</p>
                  </div>
                  <span className="text-[#639922] font-bold text-lg">{formatPrecio(precio)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
