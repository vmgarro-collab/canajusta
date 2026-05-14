import { TipoBebida } from '@/data/types';
import { getColorPorPrecioDirecto, colorClasses } from '@/lib/colors';
import { formatPrecio } from '@/lib/normalize';

interface PriceBadgeProps {
  precio: number;
  tipo: TipoBebida;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceBadge({ precio, tipo, size = 'md' }: PriceBadgeProps) {
  const color = getColorPorPrecioDirecto(precio, tipo);
  const classes = colorClasses[color];

  const sizeClasses = {
    sm: 'text-sm px-2 py-0.5 rounded',
    md: 'text-base px-3 py-1 rounded-md font-medium',
    lg: 'text-2xl px-4 py-2 rounded-lg font-bold',
  };

  return (
    <span className={`${classes.bg} text-white ${sizeClasses[size]} inline-block`}>
      {formatPrecio(precio)}
    </span>
  );
}
