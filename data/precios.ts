import { Precio } from './types';

const _precios: Precio[] = [
  // Bar Manolo (1) — muy justo
  { id: 'p1', barId: '1', tipo: 'caña', marca: 'Mahou', ubicacion: 'barra', precio: 1.5, conTapa: true, fecha: '2026-05-10', verificado: true },
  { id: 'p2', barId: '1', tipo: 'doble', marca: 'Mahou', ubicacion: 'barra', precio: 2.2, fecha: '2026-05-10', verificado: true },
  { id: 'p3', barId: '1', tipo: 'tercio', marca: 'Estrella Galicia', ubicacion: 'mesa', precio: 2.8, fecha: '2026-05-08', verificado: false },

  // La Estación (2) — precio medio
  { id: 'p4', barId: '2', tipo: 'caña', marca: 'Mahou', ubicacion: 'barra', precio: 1.8, conTapa: true, fecha: '2026-05-09', verificado: true },
  { id: 'p5', barId: '2', tipo: 'tubo', marca: 'Mahou', ubicacion: 'barra', precio: 2.5, fecha: '2026-05-09', verificado: false },
  { id: 'p6', barId: '2', tipo: 'caña', marca: 'Mahou', ubicacion: 'terraza', precio: 2.2, fecha: '2026-05-07', verificado: false },

  // Bar Plaza (3) — cañazo
  { id: 'p7', barId: '3', tipo: 'caña', marca: 'San Miguel', ubicacion: 'barra', precio: 3.2, fecha: '2026-05-11', verificado: false },
  { id: 'p8', barId: '3', tipo: 'doble', marca: 'San Miguel', ubicacion: 'terraza', precio: 4.5, fecha: '2026-05-11', verificado: true },
  { id: 'p9', barId: '3', tipo: 'tercio', marca: 'Estrella Damm', ubicacion: 'mesa', precio: 3.8, fecha: '2026-05-05', verificado: false },

  // La Terraza (4) — medio
  { id: 'p10', barId: '4', tipo: 'caña', marca: 'Cruzcampo', ubicacion: 'terraza', precio: 2.3, fecha: '2026-05-10', verificado: false },
  { id: 'p11', barId: '4', tipo: 'caña', marca: 'Cruzcampo', ubicacion: 'barra', precio: 2.0, fecha: '2026-05-08', verificado: false },
  { id: 'p12', barId: '4', tipo: 'mediana', marca: 'Cruzcampo', ubicacion: 'terraza', precio: 2.8, fecha: '2026-05-06', verificado: false },

  // El Rincón (5) — muy justo
  { id: 'p13', barId: '5', tipo: 'caña', marca: 'Mahou', ubicacion: 'barra', precio: 1.6, conTapa: true, fecha: '2026-05-12', verificado: true },
  { id: 'p14', barId: '5', tipo: 'zurito', marca: 'Mahou', ubicacion: 'barra', precio: 0.9, conTapa: true, fecha: '2026-05-12', verificado: false },
  { id: 'p15', barId: '5', tipo: 'doble', marca: 'Mahou', ubicacion: 'barra', precio: 2.3, conTapa: true, fecha: '2026-05-10', verificado: false },

  // Casa Pepe (6) — medio-justo
  { id: 'p16', barId: '6', tipo: 'caña', marca: 'Estrella Galicia', ubicacion: 'barra', precio: 1.9, conTapa: true, fecha: '2026-05-11', verificado: false },
  { id: 'p17', barId: '6', tipo: 'tercio', marca: 'Estrella Galicia', ubicacion: 'mesa', precio: 3.0, fecha: '2026-05-09', verificado: false },
  { id: 'p18', barId: '6', tipo: 'tubo', marca: 'Estrella Galicia', ubicacion: 'barra', precio: 2.7, fecha: '2026-05-07', verificado: false },

  // Bar Centro (7) — cañazo
  { id: 'p19', barId: '7', tipo: 'caña', marca: 'Otra', ubicacion: 'barra', precio: 3.5, fecha: '2026-05-13', verificado: false },
  { id: 'p20', barId: '7', tipo: 'doble', marca: 'Otra', ubicacion: 'barra', precio: 4.8, fecha: '2026-05-13', verificado: true },
  { id: 'p21', barId: '7', tipo: 'caña', marca: 'Otra', ubicacion: 'mesa', precio: 3.8, fecha: '2026-05-11', verificado: false },

  // El Soportal (8) — justo
  { id: 'p22', barId: '8', tipo: 'caña', marca: 'Mahou', ubicacion: 'barra', precio: 1.7, conTapa: true, fecha: '2026-05-12', verificado: true },
  { id: 'p23', barId: '8', tipo: 'zurito', marca: 'Mahou', ubicacion: 'barra', precio: 1.0, conTapa: true, fecha: '2026-05-12', verificado: false },
  { id: 'p24', barId: '8', tipo: 'doble', marca: 'Mahou', ubicacion: 'mesa', precio: 2.5, fecha: '2026-05-10', verificado: false },

  // La Esquina (9) — medio
  { id: 'p25', barId: '9', tipo: 'caña', marca: 'San Miguel', ubicacion: 'barra', precio: 2.4, fecha: '2026-05-11', verificado: false },
  { id: 'p26', barId: '9', tipo: 'tercio', marca: 'San Miguel', ubicacion: 'mesa', precio: 3.2, fecha: '2026-05-09', verificado: false },

  // Bar Antiguo (10) — justo
  { id: 'p27', barId: '10', tipo: 'caña', marca: 'Mahou', ubicacion: 'barra', precio: 1.6, conTapa: true, fecha: '2026-05-13', verificado: false },
  { id: 'p28', barId: '10', tipo: 'caña', marca: 'Mahou', ubicacion: 'terraza', precio: 2.0, fecha: '2026-05-11', verificado: false },
  { id: 'p29', barId: '10', tipo: 'mediana', marca: 'Mahou', ubicacion: 'barra', precio: 2.4, fecha: '2026-05-09', verificado: false },

  // La Bodeguita (11) — muy justo
  { id: 'p30', barId: '11', tipo: 'caña', marca: 'Estrella Galicia', ubicacion: 'barra', precio: 1.5, conTapa: true, fecha: '2026-05-12', verificado: true },
  { id: 'p31', barId: '11', tipo: 'doble', marca: 'Estrella Galicia', ubicacion: 'barra', precio: 2.1, fecha: '2026-05-12', verificado: false },
  { id: 'p32', barId: '11', tipo: 'zurito', marca: 'Estrella Galicia', ubicacion: 'barra', precio: 0.8, conTapa: true, fecha: '2026-05-10', verificado: false },

  // Taberna del Sur (12) — medio
  { id: 'p33', barId: '12', tipo: 'caña', marca: 'Cruzcampo', ubicacion: 'barra', precio: 2.1, conTapa: true, fecha: '2026-05-11', verificado: false },
  { id: 'p34', barId: '12', tipo: 'tercio', marca: 'Cruzcampo', ubicacion: 'mesa', precio: 3.1, fecha: '2026-05-09', verificado: false },

  // Bar los Arcos (13) — cañazo
  { id: 'p35', barId: '13', tipo: 'caña', marca: 'Estrella Damm', ubicacion: 'barra', precio: 3.0, fecha: '2026-05-10', verificado: false },
  { id: 'p36', barId: '13', tipo: 'caña', marca: 'Estrella Damm', ubicacion: 'terraza', precio: 3.5, fecha: '2026-05-08', verificado: false },
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
