export type TipoBebida =
  | 'caña'
  | 'doble'
  | 'tubo'
  | 'tercio'
  | 'zurito'
  | 'mediana';

export type Marca =
  | 'Mahou'
  | 'Estrella Damm'
  | 'San Miguel'
  | 'Cruzcampo'
  | 'Estrella Galicia'
  | 'Otra';

export type Ubicacion = 'barra' | 'mesa' | 'terraza';

export interface Bar {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  barrio?: string;
  lat: number;
  lng: number;
  verificado: boolean;
  tieneTapa: boolean;
}

export interface Precio {
  id: string;
  barId: string;
  tipo: TipoBebida;
  marca?: Marca;
  ubicacion?: Ubicacion;
  precio: number;
  conTapa?: boolean;
  fotoTique?: string;
  fecha: string;
  verificado: boolean;
}

export interface Usuario {
  id: string;
  nombre: string;
  ciudad: string;
  aportaciones: number;
  fotos: number;
  insignias: string[];
}
