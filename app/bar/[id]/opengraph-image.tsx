import { ImageResponse } from 'next/og';
import { getBar } from '@/data/bares';
import { getPrecioCanaPromedio } from '@/data/precios';
import { getColorPorPrecioDirecto } from '@/lib/colors';
import { formatPrecio } from '@/lib/normalize';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const bar = getBar(params.id);
  const precio = bar ? getPrecioCanaPromedio(params.id) : null;
  const color = precio ? getColorPorPrecioDirecto(precio, 'caña') : 'ambar';
  const hex = color === 'verde' ? '#639922' : color === 'ambar' ? '#EF9F27' : '#C73E3A';
  const label = color === 'verde' ? 'Precio justo' : color === 'ambar' ? 'Precio medio' : 'Cañazo';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: '#1A1A1A',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EF9F27', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#854F0B', fontWeight: 700, fontSize: 18 }}>CJ</span>
          </div>
          <span style={{ color: '#EF9F27', fontWeight: 700, fontSize: 24 }}>CañaJusta</span>
        </div>

        {/* Bar name */}
        <div style={{ color: '#F5F0E8', fontSize: 52, fontWeight: 700, textAlign: 'center', marginBottom: 16, maxWidth: 900 }}>
          {bar?.nombre ?? 'Bar'}
        </div>
        {bar?.direccion && (
          <div style={{ color: '#5F5E5A', fontSize: 24, marginBottom: 40 }}>{bar.direccion} · {bar.ciudad}</div>
        )}

        {/* Price badge */}
        {precio ? (
          <div style={{ background: hex, borderRadius: 24, padding: '20px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'white', fontSize: 20, marginBottom: 4 }}>Caña (200ml)</span>
            <span style={{ color: 'white', fontSize: 72, fontWeight: 700 }}>{formatPrecio(precio)}</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>{label}</span>
          </div>
        ) : (
          <div style={{ color: '#5F5E5A', fontSize: 28 }}>Sin datos de precio aún</div>
        )}
      </div>
    ),
    { ...size },
  );
}
