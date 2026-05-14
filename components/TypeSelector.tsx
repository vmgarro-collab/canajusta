'use client';

import { TipoBebida } from '@/data/types';

const TIPOS: { value: TipoBebida; label: string; ml: string }[] = [
  { value: 'caña', label: 'Caña', ml: '200ml' },
  { value: 'doble', label: 'Doble', ml: '330ml' },
  { value: 'tubo', label: 'Tubo', ml: '400ml' },
  { value: 'tercio', label: 'Tercio', ml: '330ml botella' },
  { value: 'zurito', label: 'Zurito', ml: '100ml' },
  { value: 'mediana', label: 'Mediana', ml: '250ml' },
];

interface TypeSelectorProps {
  selected: TipoBebida | null;
  onChange: (tipo: TipoBebida) => void;
}

export default function TypeSelector({ selected, onChange }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TIPOS.map(({ value, label, ml }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${
            selected === value
              ? 'bg-[#EF9F27] border-[#EF9F27] text-[#854F0B]'
              : 'bg-[#1A1A1A] border-[#D3D1C7]/30 text-[#F5F0E8]'
          }`}
        >
          <span className="font-bold text-sm">{label}</span>
          <span className={`text-xs mt-0.5 ${selected === value ? 'text-[#854F0B]' : 'text-[#5F5E5A]'}`}>
            {ml}
          </span>
        </button>
      ))}
    </div>
  );
}
