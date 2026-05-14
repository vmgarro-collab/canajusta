import { TipoBebida } from '@/data/types';

const ML_POR_TIPO: Record<TipoBebida, number> = {
  caña: 200,
  doble: 330,
  tubo: 400,
  tercio: 330,
  zurito: 100,
  mediana: 250,
};

export function precioA100ml(precio: number, tipo: TipoBebida): number {
  return (precio / ML_POR_TIPO[tipo]) * 100;
}

export function formatPrecio(precio: number): string {
  return precio.toFixed(2).replace('.', ',') + ' €';
}
