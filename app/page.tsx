'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBares } from '@/data/bares';
import { getPrecioCanaPromedio, getPrecios } from '@/data/precios';
import { getColorPorPrecioDirecto, colorClasses } from '@/lib/colors';
import { formatPrecio } from '@/lib/normalize';
import { Search, MapPin, Plus, User, ChevronRight, BadgeCheck, AlertTriangle, Star } from 'lucide-react';

/* ─── helpers ─── */
function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─── datos pre-calculados ─── */
const BARES = getBares();
const PRECIOS = getPrecios();
const BARES_CON_PRECIO = BARES
  .map(b => ({ bar: b, precio: getPrecioCanaPromedio(b.id) }))
  .filter(b => b.precio !== null) as { bar: typeof BARES[0]; precio: number }[];

const PRECIO_MEDIO = BARES_CON_PRECIO.length
  ? BARES_CON_PRECIO.reduce((s, b) => s + b.precio, 0) / BARES_CON_PRECIO.length : null;
const PRECIO_MIN = BARES_CON_PRECIO.length ? Math.min(...BARES_CON_PRECIO.map(b => b.precio)) : null;
const PRECIO_MAX = BARES_CON_PRECIO.length ? Math.max(...BARES_CON_PRECIO.map(b => b.precio)) : null;

const MAS_BARATOS = [...BARES_CON_PRECIO].sort((a, b) => a.precio - b.precio).slice(0, 5);
const MAS_CAROS   = [...BARES_CON_PRECIO].sort((a, b) => b.precio - a.precio).slice(0, 5);

const CON_TAPA = BARES_CON_PRECIO
  .filter(b => b.bar.tieneTapa)
  .sort((a, b) => a.precio - b.precio)
  .slice(0, 5);

const CANAZOS = BARES_CON_PRECIO
  .filter(b => b.precio >= 2.8)
  .sort((a, b) => b.precio - a.precio);

const VERIFICADOS = BARES_CON_PRECIO
  .filter(b => b.bar.verificado)
  .sort((a, b) => a.precio - b.precio);

// Precio medio por marca
const marcas = ['Mahou', 'Estrella Galicia', 'Cruzcampo', 'San Miguel', 'Estrella Damm', 'Otra'] as const;
const PRECIO_POR_MARCA = marcas
  .map(marca => {
    const ps = PRECIOS.filter(p => p.tipo === 'caña' && p.marca === marca);
    if (!ps.length) return null;
    return { marca, precio: ps.reduce((s, p) => s + p.precio, 0) / ps.length, n: ps.length };
  })
  .filter(Boolean)
  .sort((a, b) => a!.precio - b!.precio) as { marca: string; precio: number; n: number }[];

const BARES_SIN_PRECIO = BARES.filter(b => getPrecioCanaPromedio(b.id) === null);

/* ─── componente de sección ranking ─── */
function RankingSection({ titulo, color, items, badge }: {
  titulo: string;
  color: string;
  items: { id: string; nombre: string; precio: number; extra?: string }[];
  badge?: string;
}) {
  return (
    <div className="border border-[#D3D1C7]/10 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: color + '18' }}>
        <h2 className="font-bold text-sm" style={{ color }}>{titulo}</h2>
        {badge && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + '25', color }}>{badge}</span>}
      </div>
      <div className="divide-y divide-[#D3D1C7]/8">
        {items.map(({ id, nombre, precio, extra }, i) => {
          const color2 = getColorPorPrecioDirecto(precio, 'caña');
          const cl = colorClasses[color2];
          return (
            <Link key={id} href={`/bar/${id}`} className="flex items-center gap-3 px-4 py-3 active:bg-[#D3D1C7]/5">
              <span className="text-[#5F5E5A] text-sm w-5 text-center">{i === 0 ? '🥇' : i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#F5F0E8] text-sm font-medium truncate">{nombre}</p>
                {extra && <p className="text-[#5F5E5A] text-xs">{extra}</p>}
              </div>
              <span className={`${cl.text} font-bold text-sm`}>{formatPrecio(precio)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─── página principal ─── */
export default function HomePage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [busqueda, setBusqueda] = useState('');
  const [distancias, setDistancias] = useState<Record<string, number>>({});
  const [geoLoading, setGeoLoading] = useState(false);
  const [mapActivo, setMapActivo] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;
    let map: import('leaflet').Map | null = null;

    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (!mapRef.current || map) return;

      map = L.map(mapRef.current, {
        center: [40.3457, -3.8285], zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map);

      for (const bar of BARES) {
        const promedio = getPrecioCanaPromedio(bar.id);
        const color = promedio ? getColorPorPrecioDirecto(promedio, 'caña') : 'ambar';
        const hex = color === 'verde' ? '#639922' : color === 'ambar' ? '#EF9F27' : '#C73E3A';
        const label = promedio ? `${promedio.toFixed(2).replace('.', ',')}€` : '?';
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${hex};border:2px solid white;border-radius:20px;padding:3px 8px;font-size:12px;font-weight:700;color:white;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.5)">${label}</div>`,
          iconAnchor: [24, 12],
        });
        const marker = L.marker([bar.lat, bar.lng], { icon }).addTo(map);
        marker.on('click', () => router.push(`/bar/${bar.id}`));
        marker.bindTooltip(`<b>${bar.nombre}</b>`, { direction: 'top', offset: [0, -14] });
      }
    }

    initMap();
    return () => { map?.remove(); };
  }, [router]);

  function handleNearMe() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const d: Record<string, number> = {};
      BARES.forEach(b => { d[b.id] = distanciaKm(pos.coords.latitude, pos.coords.longitude, b.lat, b.lng); });
      setDistancias(d);
      setGeoLoading(false);
    }, () => setGeoLoading(false));
  }

  const resultadosBusqueda = busqueda
    ? BARES_CON_PRECIO.filter(b =>
        b.bar.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        b.bar.direccion.toLowerCase().includes(busqueda.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#F5F0E8]">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur border-b border-[#D3D1C7]/15 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EF9F27] flex items-center justify-center flex-none">
            <span className="text-[#854F0B] font-bold text-xs">CJ</span>
          </div>
          <div>
            <span className="text-[#EF9F27] font-bold text-lg leading-none">CañaJusta</span>
            <p className="text-[#5F5E5A] text-xs leading-none">Alcorcón</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/añadir" className="flex items-center gap-1.5 bg-[#EF9F27] text-[#854F0B] font-bold text-sm px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
            <Plus size={14} /> Añadir
          </Link>
          <Link href="/perfil" className="w-8 h-8 flex items-center justify-center text-[#5F5E5A]">
            <User size={20} />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="px-4 pt-8 pb-6 text-center border-b border-[#D3D1C7]/10">
        <p className="text-[#5F5E5A] text-sm mb-1">Precio medio de la caña en Alcorcón</p>
        <p className="font-bold text-7xl mb-1" style={{ color: PRECIO_MEDIO ? (getColorPorPrecioDirecto(PRECIO_MEDIO, 'caña') === 'verde' ? '#639922' : getColorPorPrecioDirecto(PRECIO_MEDIO, 'caña') === 'rojo' ? '#C73E3A' : '#EF9F27') : '#EF9F27' }}>
          {PRECIO_MEDIO ? formatPrecio(PRECIO_MEDIO) : '—'}
        </p>
        <p className="text-[#5F5E5A] text-xs mb-6">basado en {PRECIOS.filter(p => p.tipo === 'caña').length} cañas reportadas</p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          {[
            { label: 'bares indexados', value: String(BARES.length), color: '#EF9F27' },
            { label: 'municipio', value: '1', color: '#EF9F27' },
            { label: 'verificados', value: String(BARES.filter(b => b.verificado).length), color: '#EF9F27' },
            { label: 'más barata', value: PRECIO_MIN ? formatPrecio(PRECIO_MIN) : '—', color: '#639922' },
            { label: 'más cara', value: PRECIO_MAX ? formatPrecio(PRECIO_MAX) : '—', color: '#C73E3A' },
          ].map(s => (
            <div key={s.label} className="flex items-baseline gap-1">
              <span className="font-bold text-sm" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[#5F5E5A]">{s.label}</span>
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
          {geoLoading ? 'Obteniendo ubicación...' : Object.keys(distancias).length > 0 ? '📍 Ordenado por cercanía' : 'Ordenar por cercanía'}
        </button>

        {/* Resultados búsqueda */}
        {resultadosBusqueda && (
          <div className="mt-3 border border-[#D3D1C7]/15 rounded-xl overflow-hidden">
            {resultadosBusqueda.length === 0
              ? <p className="px-4 py-3 text-[#5F5E5A] text-sm">Sin resultados</p>
              : resultadosBusqueda.map(({ bar, precio }) => {
                  const cl = colorClasses[getColorPorPrecioDirecto(precio, 'caña')];
                  return (
                    <Link key={bar.id} href={`/bar/${bar.id}`} className="flex items-center gap-3 px-4 py-3 border-b border-[#D3D1C7]/8 last:border-0 active:bg-[#D3D1C7]/5">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F5F0E8] font-medium truncate">{bar.nombre}</p>
                        {bar.direccion && <p className="text-[#5F5E5A] text-xs truncate">{bar.direccion}</p>}
                      </div>
                      <span className={`${cl.text} font-bold text-sm`}>{formatPrecio(precio)}</span>
                    </Link>
                  );
                })
            }
          </div>
        )}
      </section>

      {/* ── MAPA ── */}
      <section className="border-b border-[#D3D1C7]/10">
        <div className="relative">
          <div ref={mapRef} style={{ height: 380 }} />
          {/* Overlay para activar en móvil */}
          {!mapActivo && (
            <div
              className="absolute inset-0 z-[500] flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={() => setMapActivo(true)}
            >
              <div className="bg-[#1A1A1A]/90 border border-[#D3D1C7]/30 rounded-xl px-5 py-3 flex items-center gap-2 text-[#F5F0E8] text-sm font-medium">
                <MapPin size={16} className="text-[#EF9F27]" />
                Toca para explorar el mapa
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-around px-4 py-2 bg-[#1A1A1A] text-xs text-[#5F5E5A]">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#639922]" />Justo (&lt;2€)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#EF9F27]" />Medio (2-2,80€)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#C73E3A]" />Cañazo (&gt;2,80€)</div>
        </div>
      </section>

      {/* ── RANKINGS ── */}
      <section className="px-4 py-6 space-y-4">
        <h2 className="text-[#D3D1C7] font-bold text-base">Rankings</h2>

        {/* Top baratos / Top caros — en grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RankingSection
            titulo="🏆 Los más baratos"
            color="#639922"
            badge="caña 200ml"
            items={MAS_BARATOS.map(b => ({ id: b.bar.id, nombre: b.bar.nombre, precio: b.precio, extra: b.bar.tieneTapa ? 'con tapa incluida' : undefined }))}
          />
          <RankingSection
            titulo="💸 Los cañazos"
            color="#C73E3A"
            badge="vergüenza ajena"
            items={MAS_CAROS.map(b => ({ id: b.bar.id, nombre: b.bar.nombre, precio: b.precio }))}
          />
        </div>

        {/* Con tapa */}
        {CON_TAPA.length > 0 && (
          <RankingSection
            titulo="🍽️ Con tapa incluida"
            color="#EF9F27"
            badge={`${CON_TAPA.length} bares`}
            items={CON_TAPA.map(b => ({ id: b.bar.id, nombre: b.bar.nombre, precio: b.precio, extra: 'tapa gratis con la caña' }))}
          />
        )}

        {/* Verificados */}
        {VERIFICADOS.length > 0 && (
          <div className="border border-[#D3D1C7]/10 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 bg-[#639922]/10">
              <BadgeCheck size={16} className="text-[#639922]" />
              <h2 className="font-bold text-sm text-[#639922]">Bares verificados CañaJusta</h2>
            </div>
            <p className="px-4 pt-2 pb-1 text-[#5F5E5A] text-xs">Precios comprobados con foto de tique.</p>
            <div className="divide-y divide-[#D3D1C7]/8">
              {VERIFICADOS.map(({ bar, precio }) => {
                const cl = colorClasses[getColorPorPrecioDirecto(precio, 'caña')];
                return (
                  <Link key={bar.id} href={`/bar/${bar.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-[#D3D1C7]/5">
                    <BadgeCheck size={14} className="text-[#639922] flex-none" />
                    <p className="flex-1 text-[#F5F0E8] text-sm truncate">{bar.nombre}</p>
                    <span className={`${cl.text} font-bold text-sm`}>{formatPrecio(precio)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Precio por marca */}
        {PRECIO_POR_MARCA.length > 0 && (
          <div className="border border-[#D3D1C7]/10 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-[#EF9F27]/10">
              <h2 className="font-bold text-sm text-[#EF9F27]">🍺 Precio medio por marca</h2>
              <p className="text-[#5F5E5A] text-xs mt-0.5">¿Qué cerveza sale más a cuenta?</p>
            </div>
            <div className="divide-y divide-[#D3D1C7]/8">
              {PRECIO_POR_MARCA.map(({ marca, precio, n }) => {
                const cl = colorClasses[getColorPorPrecioDirecto(precio, 'caña')];
                return (
                  <div key={marca} className="flex items-center gap-3 px-4 py-3">
                    <p className="flex-1 text-[#F5F0E8] text-sm">{marca}</p>
                    <p className="text-[#5F5E5A] text-xs mr-3">{n} dato{n !== 1 ? 's' : ''}</p>
                    <span className={`${cl.text} font-bold text-sm`}>{formatPrecio(precio)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hall of shame: cañazos */}
        {CANAZOS.length > 0 && (
          <div className="border border-[#C73E3A]/30 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-[#C73E3A]/10 flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#C73E3A]" />
              <div>
                <h2 className="font-bold text-sm text-[#C73E3A]">Hall of shame</h2>
                <p className="text-[#5F5E5A] text-xs">Caña a más de 2,80€ en Alcorcón. Increíble pero cierto.</p>
              </div>
            </div>
            <div className="divide-y divide-[#D3D1C7]/8">
              {CANAZOS.map(({ bar, precio }) => (
                <Link key={bar.id} href={`/bar/${bar.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-[#D3D1C7]/5">
                  <p className="flex-1 text-[#F5F0E8] text-sm truncate">{bar.nombre}</p>
                  <span className="text-[#C73E3A] font-bold text-sm">{formatPrecio(precio)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sin datos — CTA contribuir */}
        <div className="border border-dashed border-[#D3D1C7]/20 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-2">
            <Star size={16} className="text-[#EF9F27]" />
            <div>
              <h2 className="font-bold text-sm text-[#D3D1C7]">{BARES_SIN_PRECIO.length} bares sin datos aún</h2>
              <p className="text-[#5F5E5A] text-xs">10 segundos · sin registro · ayuda a todos</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 px-4 pb-4">
            {BARES_SIN_PRECIO.slice(0, 6).map(bar => (
              <Link key={bar.id} href={`/añadir?bar=${bar.id}`} className="bg-[#D3D1C7]/8 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                <p className="text-[#5F5E5A] text-xs truncate">{bar.nombre}</p>
                <span className="text-[#EF9F27] text-xs font-bold flex-none">+</span>
              </Link>
            ))}
          </div>
          {BARES_SIN_PRECIO.length > 6 && (
            <p className="text-center text-[#5F5E5A] text-xs pb-3">y {BARES_SIN_PRECIO.length - 6} más...</p>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-4 py-8 border-t border-[#D3D1C7]/10 text-center">
        <p className="text-[#F5F0E8] font-bold text-lg mb-1">¿Has tomado una caña hoy?</p>
        <p className="text-[#5F5E5A] text-sm mb-4">10 segundos · Sin registro · Ayuda a todos</p>
        <Link href="/añadir" className="inline-block bg-[#EF9F27] text-[#854F0B] font-bold text-base px-8 py-3 rounded-2xl">
          Añadir mi precio
        </Link>
        <p className="text-[#5F5E5A] text-xs mt-6">CañaJusta · Datos abiertos · Alcorcón 2026</p>
      </footer>
    </div>
  );
}
