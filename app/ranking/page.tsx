import BottomNav from '@/components/BottomNav';
import { getBares } from '@/data/bares';
import { getPrecioCanaPromedio } from '@/data/precios';
import { formatPrecio } from '@/lib/normalize';
import { Share2, ChevronDown } from 'lucide-react';

export default function RankingPage() {
  const bares = getBares();

  const baresConPrecio = bares
    .map(bar => ({ bar, precio: getPrecioCanaPromedio(bar.id) }))
    .filter(b => b.precio !== null) as { bar: typeof bares[0]; precio: number }[];

  const ordenados = [...baresConPrecio].sort((a, b) => a.precio - b.precio);
  const masJustos = ordenados.slice(0, 5);
  const masCaros = [...ordenados].reverse().slice(0, 5);

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20">
      <header className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#D3D1C7]/20 sticky top-0 z-10">
        <h1 className="text-[#F5F0E8] font-bold text-lg">Rankings</h1>
        <button className="flex items-center gap-1 text-[#D3D1C7] text-sm border border-[#D3D1C7]/30 rounded-lg px-3 py-1.5">
          Alcorcón <ChevronDown size={14} />
        </button>
      </header>

      <div className="px-4 py-6 space-y-8">
        <section>
          <div className="bg-[#C73E3A]/15 rounded-xl px-4 py-2 mb-4">
            <h2 className="text-[#C73E3A] font-bold text-base">Los 5 más caros</h2>
          </div>
          <div className="space-y-2">
            {masCaros.map(({ bar, precio }, i) => (
              <div
                key={bar.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                  i === 0
                    ? 'bg-[#C73E3A]/10 border-[#C73E3A]/30'
                    : 'bg-[#1A1A1A] border-[#D3D1C7]/15'
                }`}
              >
                <span className={`text-lg font-bold w-6 text-center ${i === 0 ? 'text-[#C73E3A]' : 'text-[#5F5E5A]'}`}>
                  {i + 1}
                </span>
                <span className="flex-1 text-[#F5F0E8] font-medium">{bar.nombre}</span>
                <span className={`font-bold ${i === 0 ? 'text-[#C73E3A] text-lg' : 'text-[#D3D1C7]'}`}>
                  {formatPrecio(precio)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-[#639922]/15 rounded-xl px-4 py-2 mb-4">
            <h2 className="text-[#639922] font-bold text-base">Los 5 más justos</h2>
          </div>
          <div className="space-y-2">
            {masJustos.map(({ bar, precio }, i) => (
              <div
                key={bar.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                  i === 0
                    ? 'bg-[#639922]/10 border-[#639922]/30'
                    : 'bg-[#1A1A1A] border-[#D3D1C7]/15'
                }`}
              >
                <span className={`text-lg font-bold w-6 text-center ${i === 0 ? 'text-[#639922]' : 'text-[#5F5E5A]'}`}>
                  {i + 1}
                </span>
                <span className="flex-1 text-[#F5F0E8] font-medium">{bar.nombre}</span>
                <span className={`font-bold ${i === 0 ? 'text-[#639922] text-lg' : 'text-[#D3D1C7]'}`}>
                  {formatPrecio(precio)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <button className="w-full border border-[#EF9F27] text-[#EF9F27] font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2">
          <Share2 size={18} />
          Compártelo en redes
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
