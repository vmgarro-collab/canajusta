'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Camera, CheckCircle } from 'lucide-react';
import TypeSelector from '@/components/TypeSelector';
import { TipoBebida } from '@/data/types';
import { getBares, getBar } from '@/data/bares';

function AñadirForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barIdParam = searchParams.get('bar');

  const [tipo, setTipo] = useState<TipoBebida | null>('caña');
  const [precio, setPrecio] = useState('');
  const [barId, setBarId] = useState(barIdParam ?? '');
  const [busqueda, setBusqueda] = useState('');
  const [exito, setExito] = useState(false);

  const bar = barId ? getBar(barId) : null;
  const bares = getBares();
  const baresFiltrados = busqueda
    ? bares.filter(b => b.nombre.toLowerCase().includes(busqueda.toLowerCase())).slice(0, 5)
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tipo || !precio || !barId) return;
    setExito(true);
    setTimeout(() => router.push('/mapa'), 1800);
  }

  if (exito) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <CheckCircle size={64} className="text-[#639922]" />
        <h2 className="text-[#F5F0E8] text-2xl font-bold">¡Precio añadido!</h2>
        <p className="text-[#5F5E5A]">Gracias por contribuir. Volviendo al mapa…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-8">
      <header className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#D3D1C7]/20 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-[#D3D1C7]">
          <X size={22} />
        </button>
        <h1 className="text-[#F5F0E8] font-bold text-lg">Añadir precio</h1>
        <div className="w-6" />
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {bar ? (
          <div className="bg-[#EF9F27]/10 border border-[#EF9F27]/30 rounded-xl px-4 py-3">
            <p className="text-[#EF9F27] font-medium">{bar.nombre}</p>
            <p className="text-[#5F5E5A] text-sm">{bar.direccion}</p>
          </div>
        ) : (
          <div>
            <label className="text-[#D3D1C7] text-sm font-medium mb-2 block">Bar</label>
            <input
              type="text"
              placeholder="Buscar bar..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#D3D1C7]/30 rounded-xl px-4 py-3 text-[#F5F0E8] placeholder-[#5F5E5A] focus:outline-none focus:border-[#EF9F27]"
            />
            {baresFiltrados.length > 0 && (
              <div className="mt-1 border border-[#D3D1C7]/20 rounded-xl overflow-hidden">
                {baresFiltrados.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => { setBarId(b.id); setBusqueda(''); }}
                    className="w-full text-left px-4 py-3 text-[#F5F0E8] hover:bg-[#D3D1C7]/10 border-b border-[#D3D1C7]/10 last:border-0"
                  >
                    <p className="font-medium">{b.nombre}</p>
                    <p className="text-[#5F5E5A] text-sm">{b.direccion}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="text-[#D3D1C7] text-sm font-medium mb-3 block">Tipo de bebida</label>
          <TypeSelector selected={tipo} onChange={setTipo} />
        </div>

        <div>
          <label className="text-[#D3D1C7] text-sm font-medium mb-2 block">Precio</label>
          <div className="relative">
            <input
              type="number"
              step="0.05"
              min="0.5"
              max="10"
              placeholder="1,80"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#D3D1C7]/30 rounded-xl px-4 py-4 text-[#F5F0E8] text-3xl font-bold text-center placeholder-[#5F5E5A] focus:outline-none focus:border-[#EF9F27]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5F5E5A] text-2xl font-bold">€</span>
          </div>
        </div>

        <div>
          <label className="text-[#D3D1C7] text-sm font-medium mb-2 block">Foto del tique <span className="text-[#5F5E5A]">(opcional)</span></label>
          <div className="border-2 border-dashed border-[#D3D1C7]/30 rounded-xl h-28 flex flex-col items-center justify-center gap-2 text-[#5F5E5A] cursor-pointer hover:border-[#EF9F27]/50 transition-colors">
            <Camera size={24} />
            <span className="text-sm">+ Subir foto</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!tipo || !precio || !barId}
          className="w-full bg-[#EF9F27] text-[#854F0B] font-bold text-lg py-4 rounded-2xl active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Subir precio
        </button>

        <p className="text-center text-[#5F5E5A] text-sm">10 segundos · Sin registro</p>
      </form>
    </div>
  );
}

export default function AñadirPage() {
  return (
    <Suspense>
      <AñadirForm />
    </Suspense>
  );
}
