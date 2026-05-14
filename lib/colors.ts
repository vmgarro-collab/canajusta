export function getColorPorPrecio(precioPor100ml: number): 'verde' | 'ambar' | 'rojo' {
  if (precioPor100ml < 1) return 'verde';
  if (precioPor100ml < 1.4) return 'ambar';
  return 'rojo';
}

export function getColorPorPrecioDirecto(precio: number, tipo: string): 'verde' | 'ambar' | 'rojo' {
  const ml: Record<string, number> = {
    caña: 200, doble: 330, tubo: 400, tercio: 330, zurito: 100, mediana: 250,
  };
  const volumen = ml[tipo] ?? 200;
  return getColorPorPrecio((precio / volumen) * 100);
}

export const colorClasses = {
  verde: {
    bg: 'bg-[#639922]',
    bgLight: 'bg-[#639922]/10',
    text: 'text-[#639922]',
    border: 'border-[#639922]',
    hex: '#639922',
  },
  ambar: {
    bg: 'bg-[#EF9F27]',
    bgLight: 'bg-[#EF9F27]/10',
    text: 'text-[#EF9F27]',
    border: 'border-[#EF9F27]',
    hex: '#EF9F27',
  },
  rojo: {
    bg: 'bg-[#C73E3A]',
    bgLight: 'bg-[#C73E3A]/10',
    text: 'text-[#C73E3A]',
    border: 'border-[#C73E3A]',
    hex: '#C73E3A',
  },
};
