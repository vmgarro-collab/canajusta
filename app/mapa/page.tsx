'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { getBares } from '@/data/bares';
import { getPrecioCanaPromedio } from '@/data/precios';
import { getColorPorPrecioDirecto, colorClasses } from '@/lib/colors';
import { formatPrecio } from '@/lib/normalize';
import { SlidersHorizontal, Navigation, X, MapPin, List, Map } from 'lucide-react';
import { Bar } from '@/data/types';

function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const TODOS_LOS_BARES = getBares().map(b => ({
  bar: b,
  precio: getPrecioCanaPromedio(b.id),
}));

const TOTAL_BARES = getBares().length;
const TOTAL_VERIFICADOS = getBares().filter(b => b.verificado).length;

export default function MapaPage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [vista, setVista] = useState<'lista' | 'mapa'>('lista');
  const [distancias, setDistancias] = useState<Record<string, number>>({});
  const [geoError, setGeoError] = useState('');
  const [modal, setModal] = useState<{ bar: Bar; precio: number; distancia: number }[] | null>(null);

  // Pedir ubicación al montar (silencioso, sin bloqueante)
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      const d: Record<string, number> = {};
      getBares().forEach(b => { d[b.id] = distanciaKm(latitude, longitude, b.lat, b.lng); });
      setDistancias(d);
    });
  }, []);

  // Init mapa solo cuando está visible
  useEffect(() => {
    if (vista !== 'mapa' || !mapRef.current) return;
    let map: import('leaflet').Map | null = null;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (!mapRef.current || map) return;
      map = L.map(mapRef.current, { center: [40.3457, -3.8285], zoom: 14, zoomControl: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map);
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
  }, [vista, router]);

  function handleMasBaratos() {
    if (!navigator.geolocation) { setGeoError('Tu navegador no soporta geolocalizacion'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const cercanos = TODOS_LOS_BARES
          .filter(b => b.precio !== null)
          .map(b => ({ bar: b.bar, precio: b.precio!, distancia: distanciaKm(latitude, longitude, b.bar.lat, b.bar.lng) }))
          .sort((a, b) => a.precio - b.precio)
          .slice(0, 3);
        setModal(cercanos);
        setGeoError('');
      },
      () => setGeoError('No se pudo obtener tu ubicacion'),
    );
  }

  // Lista ordenada: si hay distancias, ordena por precio; si no, por precio también
  const baresOrdenados = [...TODOS_LOS_BARES]
    .filter(b => b.precio !== null)
    .sort((a, b) => a.precio! - b.precio!);

  const baresSinPrecio = TODOS_LOS_BARES.filter(b => b.precio === null);

  return (
    <div className="flex flex-col bg-[#1A1A1A]" style={{ height: '100dvh' }}>

      {/* Header */}
      <header className="flex-none flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#D3D1C7]/20">
        <div>
          <h1 className="text-[#F5F0E8] font-bold text-lg leading-none">Alcorcón</h1>
          <p className="text-[#5F5E5A] text-xs mt-0.5">
            <span className="text-[#EF9F27]">{TOTAL_BARES}</span> locales ·{' '}
            <span className="text-[#EF9F27]">{TOTAL_VERIFICADOS}</span> verificados
          </p>
        </div>
        {/* Toggle lista/mapa */}
        <div className="flex items-center bg-[#D3D1C7]/10 rounded-lg p-1 gap-1">
          <button
            onClick={() => setVista('lista')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${vista === 'lista' ? 'bg-[#EF9F27] text-[#854F0B]' : 'text-[#5F5E5A]'}`}
          >
            <List size={13} /> Lista
          </button>
          <button
            onClick={() => setVista('mapa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${vista === 'mapa' ? 'bg-[#EF9F27] text-[#854F0B]' : 'text-[#5F5E5A]'}`}
          >
            <Map size={13} /> Mapa
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 min-h-0 relative">

        {/* ── VISTA LISTA ── */}
        {vista === 'lista' && (
          <div className="absolute inset-0 overflow-y-auto">
            {/* Botón ubicación */}
            <div className="px-4 pt-3 pb-2">
              <button
                onClick={handleMasBaratos}
                className="w-full flex items-center justify-center gap-2 bg-[#EF9F27]/10 border border-[#EF9F27]/30 text-[#EF9F27] text-sm font-medium px-4 py-2.5 rounded-xl active:scale-95 transition-transform"
              >
                <Navigation size={14} />
                {Object.keys(distancias).length > 0 ? 'Ver los 3 más baratos cerca' : 'Más baratos cerca de mí'}
              </button>
              {geoError && <p className="text-[#C73E3A] text-xs mt-1 text-center">{geoError}</p>}
            </div>

            {/* Bares con precio */}
            <div className="px-4 pb-2">
              <p className="text-[#5F5E5A] text-xs font-medium mb-2 uppercase tracking-wide">Ordenados por precio</p>
              <div className="space-y-2">
                {baresOrdenados.map(({ bar, precio }, i) => {
                  const color = getColorPorPrecioDirecto(precio!, 'caña');
                  const cl = colorClasses[color];
                  const dist = distancias[bar.id];
                  return (
                    <Link
                      key={bar.id}
                      href={`/bar/${bar.id}`}
                      className="flex items-center gap-3 bg-[#D3D1C7]/8 border border-[#D3D1C7]/10 rounded-xl px-4 py-3 active:bg-[#D3D1C7]/15"
                    >
                      <span className="text-[#5F5E5A] text-sm w-5 text-center font-medium">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F5F0E8] font-medium truncate">{bar.nombre}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {bar.direccion && (
                            <span className="text-[#5F5E5A] text-xs truncate">{bar.direccion}</span>
                          )}
                          {dist !== undefined && (
                            <span className="text-[#5F5E5A] text-xs flex-none">
                              · {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-none text-right">
                        <span className={`${cl.text} font-bold text-base`}>{formatPrecio(precio!)}</span>
                        <p className="text-[#5F5E5A] text-xs">caña</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bares sin precio */}
            {baresSinPrecio.length > 0 && (
              <div className="px-4 pb-6 mt-4">
                <p className="text-[#5F5E5A] text-xs font-medium mb-2 uppercase tracking-wide">Sin precio aún — ¡añade el tuyo!</p>
                <div className="space-y-2">
                  {baresSinPrecio.map(({ bar }) => (
                    <Link
                      key={bar.id}
                      href={`/añadir?bar=${bar.id}`}
                      className="flex items-center gap-3 border border-dashed border-[#D3D1C7]/20 rounded-xl px-4 py-3"
                    >
                      <MapPin size={16} className="text-[#5F5E5A] flex-none" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#5F5E5A] font-medium truncate">{bar.nombre}</p>
                        {bar.direccion && <p className="text-[#5F5E5A]/60 text-xs truncate">{bar.direccion}</p>}
                      </div>
                      <span className="text-[#EF9F27] text-xs font-medium flex-none">+ precio</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── VISTA MAPA ── */}
        {vista === 'mapa' && (
          <div className="absolute inset-0">
            <div ref={mapRef} className="absolute inset-0" />
            <button
              onClick={handleMasBaratos}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-[#1A1A1A] text-[#F5F0E8] text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-[#D3D1C7]/20 active:scale-95 transition-transform whitespace-nowrap"
            >
              <Navigation size={14} className="text-[#EF9F27]" />
              Más baratos cerca
            </button>
            <div className="absolute bottom-3 left-4 right-4 bg-[#F5F0E8] rounded-xl px-4 py-2 flex items-center justify-around text-sm z-[1000] shadow-lg">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#639922]" /><span className="text-[#1A1A1A]">Justo</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#EF9F27]" /><span className="text-[#1A1A1A]">Medio</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#C73E3A]" /><span className="text-[#1A1A1A]">Cañazo</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Nav — flex-none, fuera del área del mapa */}
      <BottomNav fixed={false} />

      {/* Modal más baratos */}
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
