'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BadgeCheck, ShieldCheck, Camera } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Bar, Precio } from '@/data/types';
import { getColorPorPrecioDirecto, colorClasses } from '@/lib/colors';
import { formatPrecio } from '@/lib/normalize';

interface Props {
  bar: Bar;
  precios: Precio[];
  promedioCana: number | null;
  color: 'verde' | 'ambar' | 'rojo';
  colors: typeof colorClasses['verde'];
}

export default function BarFichaClient({ bar, precios, promedioCana, color, colors }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20">
      <header className="flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] border-b border-[#D3D1C7]/20 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-[#D3D1C7]">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[#F5F0E8] font-bold text-lg truncate">{bar.nombre}</h1>
      </header>

      <div className="px-4 py-6 space-y-5">
        <div>
          <h2 className="text-[#F5F0E8] text-2xl font-bold">{bar.nombre}</h2>
          {bar.direccion && <p className="text-[#5F5E5A] text-sm mt-1">{bar.direccion}{bar.barrio ? ` · ${bar.barrio}` : ''}</p>}
        </div>

        {promedioCana ? (
          <div className={`${colors.bgLight} border ${colors.border} rounded-2xl p-5 text-center`}>
            <p className={`${colors.text} text-xs font-medium uppercase tracking-wide mb-2`}>Caña (200ml)</p>
            <p className={`${colors.text} text-5xl font-bold mb-1`}>{formatPrecio(promedioCana)}</p>
            <p className="text-[#5F5E5A] text-sm">Promedio · {precios.filter(p => p.tipo === 'caña').length} dato{precios.filter(p => p.tipo === 'caña').length !== 1 ? 's' : ''}</p>
          </div>
        ) : (
          <div className="border border-[#D3D1C7]/20 rounded-2xl p-5 text-center">
            <p className="text-[#5F5E5A] text-sm">Sin datos de precio aún</p>
            <p className="text-[#D3D1C7] text-xs mt-1">¡Sé el primero en añadir el precio!</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {color === 'verde' && (
            <span className="bg-[#639922]/20 text-[#639922] text-xs font-medium px-3 py-1 rounded-full">Precio justo</span>
          )}
          {bar.tieneTapa && (
            <span className="bg-[#EF9F27]/20 text-[#EF9F27] text-xs font-medium px-3 py-1 rounded-full">Con tapa</span>
          )}
          {bar.verificado && (
            <span className="bg-[#639922]/20 text-[#639922] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck size={12} />
              Bar verificado
            </span>
          )}
        </div>

        {precios.length > 0 && (
          <div>
            <h3 className="text-[#D3D1C7] font-medium mb-3">Todos los precios</h3>
            <div className="space-y-2">
              {precios.slice(0, 5).map(p => {
                const c = getColorPorPrecioDirecto(p.precio, p.tipo);
                const cl = colorClasses[c];
                return (
                  <div key={p.id} className="bg-[#1A1A1A] border border-[#D3D1C7]/15 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-[#F5F0E8] font-medium capitalize">{p.tipo}</span>
                      {p.marca && <span className="text-[#5F5E5A] text-sm ml-2">· {p.marca}</span>}
                      {p.ubicacion && <span className="text-[#5F5E5A] text-sm ml-1">· {p.ubicacion}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {p.verificado && <BadgeCheck size={14} className="text-[#639922]" />}
                      <span className={`${cl.text} font-bold`}>{formatPrecio(p.precio)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[#D3D1C7] font-medium mb-3">Última foto del tique</h3>
          <div className="border-2 border-dashed border-[#D3D1C7]/30 rounded-xl h-32 flex flex-col items-center justify-center gap-2 text-[#5F5E5A]">
            <Camera size={28} />
            <span className="text-sm">Sin fotos aún</span>
          </div>
        </div>

        <Link
          href={`/añadir?bar=${bar.id}`}
          className="block w-full bg-[#EF9F27] text-[#854F0B] font-bold text-lg py-4 rounded-2xl text-center active:scale-95 transition-transform"
        >
          Añadir mi precio
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
