import BottomNav from '@/components/BottomNav';
import { Bell } from 'lucide-react';

const USUARIO = {
  nombre: 'Víctor',
  ciudad: 'Alcorcón',
  aportaciones: 47,
  fotos: 23,
  canazos: 5,
  insignias: [
    { emoji: '⭐', label: 'Pionero', desc: 'Uno de los primeros' },
    { emoji: '⚖️', label: 'Justiciero', desc: '20 precios añadidos' },
    { emoji: '📷', label: 'Fotógrafo', desc: '10 tiques subidos' },
  ],
  notificaciones: [
    { texto: 'Bar Manolo ha bajado el precio de la caña a 1,40€', tiempo: 'Hace 2h' },
    { texto: 'Tu aportación en El Soportal fue verificada', tiempo: 'Ayer' },
    { texto: 'Nuevo bar verificado en tu zona: La Bodeguita', tiempo: 'Hace 3 días' },
  ],
};

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20">
      <header className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#D3D1C7]/20 sticky top-0 z-10">
        <h1 className="text-[#F5F0E8] font-bold text-lg">Mi cuenta</h1>
        <Bell size={22} className="text-[#D3D1C7]" />
      </header>

      <div className="px-4 py-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#EF9F27] flex items-center justify-center">
            <span className="text-[#854F0B] font-bold text-3xl">{USUARIO.nombre[0]}</span>
          </div>
          <div className="text-center">
            <h2 className="text-[#F5F0E8] text-2xl font-bold">{USUARIO.nombre}</h2>
            <p className="text-[#5F5E5A] text-sm">{USUARIO.ciudad} · {USUARIO.aportaciones} aportaciones</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { n: USUARIO.aportaciones, label: 'precios' },
            { n: USUARIO.fotos, label: 'fotos' },
            { n: USUARIO.canazos, label: 'cañazos\nreportados' },
          ].map(({ n, label }) => (
            <div key={label} className="bg-[#D3D1C7]/10 rounded-xl p-3 text-center">
              <p className="text-[#EF9F27] text-2xl font-bold">{n}</p>
              <p className="text-[#D3D1C7] text-xs mt-0.5 whitespace-pre-line">{label}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-[#D3D1C7] font-medium mb-3">Insignias</h3>
          <div className="flex gap-3 flex-wrap">
            {USUARIO.insignias.map(ins => (
              <div key={ins.label} className="bg-[#EF9F27]/10 border border-[#EF9F27]/30 rounded-xl px-3 py-2 flex items-center gap-2">
                <span className="text-xl">{ins.emoji}</span>
                <div>
                  <p className="text-[#EF9F27] text-sm font-medium">{ins.label}</p>
                  <p className="text-[#5F5E5A] text-xs">{ins.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[#D3D1C7] font-medium mb-3">Notificaciones</h3>
          <div className="space-y-2">
            {USUARIO.notificaciones.map((n, i) => (
              <div key={i} className="bg-[#D3D1C7]/10 rounded-xl px-4 py-3">
                <p className="text-[#F5F0E8] text-sm">{n.texto}</p>
                <p className="text-[#5F5E5A] text-xs mt-1">{n.tiempo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
