'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STATS = { bares: 120, municipios: 1, verificados: 4 };

export default function Bienvenida() {
  const router = useRouter();

  useEffect(() => {
    const visto = localStorage.getItem('canajusta_bienvenida');
    if (visto) router.replace('/mapa');
  }, [router]);

  function handleEntrar() {
    localStorage.setItem('canajusta_bienvenida', '1');
    router.push('/mapa');
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-10">
        <div className="w-20 h-20 rounded-full bg-[#EF9F27] flex items-center justify-center mx-auto mb-4">
          <span className="text-[#854F0B] font-bold text-3xl">CJ</span>
        </div>
        <h1 className="text-[#EF9F27] font-bold text-2xl tracking-tight">CañaJusta</h1>
      </div>

      <div className="max-w-xs mb-8">
        <p className="text-[#F5F0E8] font-bold text-3xl leading-tight mb-4">
          Hay que bajar los precios de las cervezas ya.
        </p>
        <p className="text-[#D3D1C7] text-base leading-relaxed">
          El índice ciudadano del precio de la caña en España. Hecho por gente cansada de pagar 4€ por una mahou.
        </p>
      </div>

      {/* Métricas de credibilidad */}
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="text-[#F5F0E8]"><span className="text-[#EF9F27] font-bold">{STATS.bares}</span> bares</span>
        <span className="text-[#5F5E5A]">·</span>
        <span className="text-[#F5F0E8]"><span className="text-[#EF9F27] font-bold">{STATS.municipios}</span> municipio</span>
        <span className="text-[#5F5E5A]">·</span>
        <span className="text-[#F5F0E8]"><span className="text-[#EF9F27] font-bold">{STATS.verificados}</span> verificados</span>
      </div>

      <button
        onClick={handleEntrar}
        className="w-full max-w-xs bg-[#EF9F27] text-[#854F0B] font-bold text-lg py-4 rounded-2xl mb-4 active:scale-95 transition-transform"
      >
        Ver mapa de Alcorcón
      </button>

      <p className="text-[#5F5E5A] text-sm">Sin registro · Datos abiertos</p>
    </div>
  );
}
