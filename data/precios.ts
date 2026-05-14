import { Precio } from './types';

// Precios de ejemplo sobre bares reales de OSM — IDs = OSM node ID
const _precios: Precio[] = [
  // Jamon y Pan
  { id: 'p1',  barId: '6435780630',  tipo: 'caña',   marca: 'Mahou',           ubicacion: 'barra',   precio: 1.7,  conTapa: true,  fecha: '2026-05-12', verificado: true  },
  { id: 'p2',  barId: '6435780630',  tipo: 'doble',  marca: 'Mahou',           ubicacion: 'barra',   precio: 2.4,                  fecha: '2026-05-10', verificado: false },

  // Bar Apolo
  { id: 'p3',  barId: '10704532605', tipo: 'caña',   marca: 'Mahou',           ubicacion: 'barra',   precio: 1.5,  conTapa: true,  fecha: '2026-05-13', verificado: true  },
  { id: 'p4',  barId: '10704532605', tipo: 'zurito', marca: 'Mahou',           ubicacion: 'barra',   precio: 0.9,  conTapa: true,  fecha: '2026-05-13', verificado: false },

  // Dublin 98
  { id: 'p5',  barId: '11435570350', tipo: 'caña',   marca: 'Estrella Galicia',ubicacion: 'barra',   precio: 2.5,                  fecha: '2026-05-11', verificado: false },
  { id: 'p6',  barId: '11435570350', tipo: 'tercio', marca: 'Estrella Galicia',ubicacion: 'mesa',    precio: 3.5,                  fecha: '2026-05-09', verificado: false },

  // Beerseker
  { id: 'p7',  barId: '11435666913', tipo: 'caña',   marca: 'Otra',            ubicacion: 'barra',   precio: 3.2,                  fecha: '2026-05-10', verificado: false },
  { id: 'p8',  barId: '11435666913', tipo: 'doble',  marca: 'Otra',            ubicacion: 'barra',   precio: 4.5,                  fecha: '2026-05-10', verificado: true  },

  // Kiriki Bar
  { id: 'p9',  barId: '11248458723', tipo: 'caña',   marca: 'Mahou',           ubicacion: 'barra',   precio: 2.0,                  fecha: '2026-05-12', verificado: false },
  { id: 'p10', barId: '11248458723', tipo: 'tubo',   marca: 'Mahou',           ubicacion: 'mesa',    precio: 2.8,                  fecha: '2026-05-11', verificado: false },

  // Bacterio Brewing CO
  { id: 'p11', barId: '10913894577', tipo: 'caña',   marca: 'Otra',            ubicacion: 'barra',   precio: 3.5,                  fecha: '2026-05-13', verificado: false },
  { id: 'p12', barId: '10913894577', tipo: 'tercio', marca: 'Otra',            ubicacion: 'mesa',    precio: 4.2,                  fecha: '2026-05-13', verificado: true  },

  // Café-bar Vico's Sandra
  { id: 'p13', barId: '8398265600',  tipo: 'caña',   marca: 'Mahou',           ubicacion: 'barra',   precio: 1.6,                  fecha: '2026-05-11', verificado: false },

  // La Tasca
  { id: 'p14', barId: '12121057101', tipo: 'caña',   marca: 'Cruzcampo',       ubicacion: 'barra',   precio: 1.8,  conTapa: true,  fecha: '2026-05-12', verificado: false },
  { id: 'p15', barId: '12121057101', tipo: 'mediana',marca: 'Cruzcampo',       ubicacion: 'terraza', precio: 2.5,                  fecha: '2026-05-10', verificado: false },

  // Bar Restaurante Celedonio
  { id: 'p16', barId: '4195880680',  tipo: 'caña',   marca: 'San Miguel',      ubicacion: 'barra',   precio: 2.2,                  fecha: '2026-05-09', verificado: false },
  { id: 'p17', barId: '4195880680',  tipo: 'caña',   marca: 'San Miguel',      ubicacion: 'terraza', precio: 2.7,                  fecha: '2026-05-07', verificado: false },

  // Felipe
  { id: 'p18', barId: '13019334967', tipo: 'caña',   marca: 'Mahou',           ubicacion: 'barra',   precio: 1.9,                  fecha: '2026-05-14', verificado: false },
];

export function getPrecios(): Precio[] {
  return _precios;
}

export function getPreciosDeBar(barId: string): Precio[] {
  return _precios.filter(p => p.barId === barId);
}

export function getPrecioCanaPromedio(barId: string): number | null {
  const canas = _precios.filter(p => p.barId === barId && p.tipo === 'caña');
  if (canas.length === 0) return null;
  return canas.reduce((sum, p) => sum + p.precio, 0) / canas.length;
}
