'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBares } from '@/data/bares';
import { getPrecioCanaPromedio, getPrecios } from '@/data/precios';
import { getColorPorPrecioDirecto, colorClasses } from '@/lib/colors';
import { formatPrecio } from '@/lib/normalize';
import { Search, MapPin, Plus, User, ChevronRight, BadgeCheck } from 'lucide-react';

function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const BARES = getBares();
const BARES_CON_PRECIO = BARES.map(b => ({ bar: b, precio: getPrecioCanaPromedio(b.id) })).filter(b => b.precio !== null) as { bar: typeof BARES[0]; precio: number }[];
const PRECIOS_TOTAL = getPrecios().length;
const PRECIO_MEDIO = BARES_CON_PRECIO.length ? BARES_CON_PRECIO.reduce((s, b) => s + b.precio, 0) / BARES_CON_PRECIO.length : null;
const PRECIO_MIN = BARES_CON_PRECIO.length ? Math.min(...BARES_CON_PRECIO.map(b => b.precio)) : null;
const PRECIO_MAX = BARES_CON_PRECIO.length ? Math.max(...BARES_CON_PRECIO.map(b => b.precio)) : null;
const MAS_BARATOS = [...BARES_CON_PRECIO].sort((a, b) => a.precio - b.precio).slice(0, 5);
const MAS_CAROS = [...BARES_CON_PRECIO].sort((a, b) => b.precio - a.precio).slice(0, 5);

export default function HomePage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [busqueda, setBusqueda] = useState('');
  const [distancias, setDistancias] = useState<Record<string, number>>({});
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;
    let map: import('leaflet').Map | null = null;
    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (!mapRef.current || map) return;
      map = L.map(mapRef.current, { center: [40.3457, -3.8285], zoom: 13, zoomControl: false, scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map);
      for (const bar of BARES) {
        const promedio = getPrecioCanaPromedio(bar.id);
        const color = promedio ? getColorPorPrecioDirecto(promedio, 'caña') : 'ambar';
        const hex = color === 'verde' ? '#639922' : color === 'ambar' ? '#EF9F27' : '#C73E3A';
        const label = promedio ? `${promedio.toFixed(2).replace('.', ',')}€` : '?';
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${hex};border:2px solid white;border-radius:20px;padding:2px 7px;font-size:11px;font-weight:700;color:white;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.4)">${label}</div>`,
          iconAnchor: [20, 10],
        });
        const marker = L.marker([bar.lat, bar.lng], { icon }).addTo(map);
        marker.on('click', () => router.push(`/bar/${bar.id}`));
      }
    }
    initMap();
    return () => { map?.remove(); };
  }, [router]);

  function handleNearMe() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      const d: Record<string, number> = {};
      BARES.forEach(b => { d[b.id] = distanciaKm(latitude, longitude, b.lat, b.lng); });
      setDistancias(d);
      setGeoLoading(false);
    }, () => setGeoLoading(false));
  }

  const baresFiltrados = busqueda
    ? BARES.filter(b => b.nombre.toLowerCase().includes(busqueda.toLowerCase()) || b.direccion.toLowerCase().includes(busqueda.toLowerCase()))
    : null;

  const baresConPrecioFiltrados: { bar: typeof BARES[0]; precio: number }[] = baresFiltrados
    ? baresFiltrados.map(b => ({ bar: b, precio: getPrecioCanaPromedio(b.id) ?? 0 })).filter(b => b.precio > 0)
    : Object.keys(distancias).length > 0
      ? [...BARES_CON_PRECIO].sort((a, b) => (distancias[a.bar.id] ?? 99) - (distancias[b.bar.id] ?? 99))
      : [...BARES_CON_PRECIO].sort((a, b) => a.precio - b.precio);

  const baresListados = baresConPrecioFiltrados;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#F5F0E8]">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur border-b border-[#D3D1C7]/15 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EF9F27] flex items-center justify-center">
            <span className="text-[#854F0B] font-bold text-xs">CJ</span>
          </div>
          <span className="text-[#EF9F27] font-bold text-lg">CañaJusta</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/añadir" className="flex items-center gap-1.5 bg-[#EF9F27] text-[#854F0B] font-bold text-sm px-3 py-1.5 rounded-lg">
            <Plus size={14} />
            Añadir precio
          </Link>
          <Link href="/perfil" className="w-8 h-8 flex items-center justify-center text-[#5F5E5A]">
            <User size={20} />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="px-4 py-8 text-center border-b border-[#D3D1C7]/10">
        <p className="text-[#5F5E5A] text-sm mb-1">Precio medio de la caña en Alcorcón</p>
        <p className="text-[#EF9F27] font-bold text-6xl mb-2">
          {PRECIO_MEDIO ? formatPrecio(PRECIO_MEDIO) : '—'}
        </p>
        <p className="text-[#5F5E5A] text-xs">basado en {PRECIOS_TOTAL} precios reportados</p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-0 mt-6 text-xs divide-x divide-[#D3D1C7]/20">
          {[
            { label: 'bares', value: BARES.length },
            { label: 'municipio', value: 1 },
            { label: 'verificados', value: BARES.filter(b => b.verificado).length },
            { label: 'más barato', value: PRECIO_MIN ? formatPrecio(PRECIO_MIN) : '—', color: '#639922' },
            { label: 'más caro', value: PRECIO_MAX ? formatPrecio(PRECIO_MAX) : '—', color: '#C73E3A' },
          ].map(s => (
            <div key={s.label} className="px-3 py-1 text-center">
              <p className="font-bold text-sm" style={{ color: s.color ?? '#EF9F27' }}>{s.value}</p>
              <p className="text-[#5F5E5A]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUSCADOR ── */}
      <section className="px-4 py-4 border-b border-[#D3D1C7]/10">
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F5E5A]" />
          <input
            type="text"
            placeholder="Buscar bar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full bg-[#D3D1C7]/10 border border-[#D3D1C7]/20 rounded-xl pl-9 pr-4 py-3 text-[#F5F0E8] placeholder-[#5F5E5A] focus:outline-none focus:border-[#EF9F27] text-sm"
          />
        </div>
        <button
          onClick={handleNearMe}
          disabled={geoLoading}
          className="w-full flex items-center justify-center gap-2 border border-[#EF9F27]/40 text-[#EF9F27] text-sm font-medium py-2.5 rounded-xl active:scale-95 transition-transform"
        >
          <MapPin size={14} />
          {geoLoading ? 'Obteniendo ubicación...' : Object.keys(distancias).length > 0 ? 'Ordenado por cercanía ✓' : 'Ordenar por cercanía'}
        </button>
      </section>

      {/* ── MAPA ── */}
      <section className="border-b border-[#D3D1C7]/10">
        <div ref={mapRef} style={{ height: 260 }} />
        <div className="flex items-center justify-around px-4 py-2 text-xs text-[#5F5E5A]">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#639922]" />Justo</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#EF9F27]" />Medio</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#C73E3A]" />Cañazo</div>
        </div>
      </section>

      {/* ── RANKINGS ── */}
      <section className="px-4 py-5 border-b border-[#D3D1C7]/10">
        <div className="grid grid-cols-2 gap-3">
          {/* Más baratos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#639922] font-bold text-xs uppercase tracking-wide">Más baratos</p>
              <Link href="/ranking" className="text-[#5F5E5A] text-xs flex items-center gap-0.5">ver más <ChevronRight size={11} /></Link>
            </div>
            <div className="space-y-1">
              {MAS_BARATOS.map(({ bar, precio }, i) => (
                <Link key={bar.id} href={`/bar/${bar.id}`} className="flex items-center gap-2 py-1.5">
                  <span className="text-[#5F5E5A] text-xs w-4">{i + 1}</span>
                  <span className="flex-1 text-[#F5F0E8] text-xs truncate">{bar.nombre}</span>
                  <span className="text-[#639922] font-bold text-xs">{formatPrecio(precio)}</span>
                </Link>
              ))}
            </div>
          </div>
          {/* Más caros */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#C73E3A] font-bold text-xs uppercase tracking-wide">Más caros</p>
              <Link href="/ranking" className="text-[#5F5E5A] text-xs flex items-center gap-0.5">ver más <ChevronRight size={11} /></Link>
            </div>
            <div className="space-y-1">
              {MAS_CAROS.map(({ bar, precio }, i) => (
                <Link key={bar.id} href={`/bar/${bar.id}`} className="flex items-center gap-2 py-1.5">
                  <span className="text-[#5F5E5A] text-xs w-4">{i + 1}</span>
                  <span className="flex-1 text-[#F5F0E8] text-xs truncate">{bar.nombre}</span>
                  <span className="text-[#C73E3A] font-bold text-xs">{formatPrecio(precio)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LISTA COMPLETA ── */}
      <section className="px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[#D3D1C7] font-medium text-sm">
            {busqueda ? `${baresFiltrados?.length ?? 0} resultados` : Object.keys(distancias).length > 0 ? 'Ordenados por cercanía' : 'Todos los bares'}
          </p>
        </div>
        <div className="space-y-2">
          {baresListados.map(({ bar, precio }) => {
            const color = getColorPorPrecioDirecto(precio, 'caña');
            const cl = colorClasses[color];
            const dist = distancias[bar.id];
            return (
              <Link key={bar.id} href={`/bar/${bar.id}`} className="flex items-center gap-3 border border-[#D3D1C7]/10 rounded-xl px-4 py-3 active:bg-[#D3D1C7]/10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[#F5F0E8] font-medium truncate">{bar.nombre}</p>
                    {bar.verificado && <BadgeCheck size={13} className="text-[#639922] flex-none" />}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {bar.direccion && <p className="text-[#5F5E5A] text-xs truncate">{bar.direccion}</p>}
                    {dist !== undefined && <p className="text-[#5F5E5A] text-xs flex-none">· {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}</p>}
                  </div>
                </div>
                <div className="flex-none text-right">
                  <p className={`${cl.text} font-bold`}>{formatPrecio(precio)}</p>
                  <p className="text-[#5F5E5A] text-xs">caña</p>
                </div>
              </Link>
            );
          })}

          {/* Bares sin precio */}
          {!busqueda && BARES.filter(b => getPrecioCanaPromedio(b.id) === null).map(bar => (
            <Link key={bar.id} href={`/añadir?bar=${bar.id}`} className="flex items-center gap-3 border border-dashed border-[#D3D1C7]/15 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-[#5F5E5A] font-medium truncate">{bar.nombre}</p>
                {bar.direccion && <p className="text-[#5F5E5A]/50 text-xs truncate">{bar.direccion}</p>}
              </div>
              <span className="text-[#EF9F27] text-xs font-medium flex-none">+ precio</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="px-4 py-8 border-t border-[#D3D1C7]/10 text-center">
        <p className="text-[#F5F0E8] font-bold text-lg mb-1">¿Has tomado una caña hoy?</p>
        <p className="text-[#5F5E5A] text-sm mb-4">10 segundos · Sin registro · Ayuda a todos</p>
        <Link href="/añadir" className="inline-block bg-[#EF9F27] text-[#854F0B] font-bold text-base px-8 py-3 rounded-2xl">
          Añadir mi precio
        </Link>
      </section>

    </div>
  );
}
