import L from 'leaflet';
import { colorClasses } from '@/lib/colors';

export function createBarIcon(color: 'verde' | 'ambar' | 'rojo'): L.DivIcon {
  const hex = colorClasses[color].hex;
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: ${hex};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}
