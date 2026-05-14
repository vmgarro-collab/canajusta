import { Bar } from './types';

const _bares: Bar[] = [
  { id: '1', nombre: 'Bar Manolo', direccion: 'C/ Mayor 23', ciudad: 'Alcorcón', barrio: 'Centro', lat: 40.3457, lng: -3.8285, verificado: true, tieneTapa: true },
  { id: '2', nombre: 'La Estación', direccion: 'Av. de Lisboa 5', ciudad: 'Alcorcón', barrio: 'Las Retamas', lat: 40.3520, lng: -3.8350, verificado: true, tieneTapa: true },
  { id: '3', nombre: 'Bar Plaza', direccion: 'Plaza de los Príncipes 1', ciudad: 'Alcorcón', barrio: 'Centro', lat: 40.3475, lng: -3.8270, verificado: false, tieneTapa: false },
  { id: '4', nombre: 'La Terraza', direccion: 'C/ Polvoranca 12', ciudad: 'Alcorcón', barrio: 'San José de Valderas', lat: 40.3380, lng: -3.8400, verificado: false, tieneTapa: false },
  { id: '5', nombre: 'El Rincón', direccion: 'C/ Cáceres 8', ciudad: 'Alcorcón', barrio: 'Parque Lisboa', lat: 40.3550, lng: -3.8290, verificado: false, tieneTapa: true },
  { id: '6', nombre: 'Casa Pepe', direccion: 'C/ Iglesia 15', ciudad: 'Alcorcón', barrio: 'Centro', lat: 40.3460, lng: -3.8295, verificado: false, tieneTapa: true },
  { id: '7', nombre: 'Bar Centro', direccion: 'C/ Fuenlabrada 22', ciudad: 'Alcorcón', barrio: 'Centro', lat: 40.3470, lng: -3.8310, verificado: false, tieneTapa: false },
  { id: '8', nombre: 'El Soportal', direccion: 'C/ Mayor 45', ciudad: 'Alcorcón', barrio: 'Centro', lat: 40.3450, lng: -3.8275, verificado: true, tieneTapa: true },
  { id: '9', nombre: 'La Esquina', direccion: 'C/ Pinto 3', ciudad: 'Alcorcón', barrio: 'Parque Ondarreta', lat: 40.3490, lng: -3.8380, verificado: false, tieneTapa: false },
  { id: '10', nombre: 'Bar Antiguo', direccion: 'C/ Cantos 18', ciudad: 'Alcorcón', barrio: 'Centro', lat: 40.3465, lng: -3.8260, verificado: false, tieneTapa: true },
  { id: '11', nombre: 'La Bodeguita', direccion: 'C/ Pradillo 7', ciudad: 'Alcorcón', barrio: 'Parque Lisboa', lat: 40.3535, lng: -3.8320, verificado: true, tieneTapa: true },
  { id: '12', nombre: 'Taberna del Sur', direccion: 'C/ Dos de Mayo 33', ciudad: 'Alcorcón', barrio: 'Centro', lat: 40.3445, lng: -3.8300, verificado: false, tieneTapa: true },
  { id: '13', nombre: 'Bar los Arcos', direccion: 'Av. de Móstoles 14', ciudad: 'Alcorcón', barrio: 'El Torreón', lat: 40.3410, lng: -3.8330, verificado: false, tieneTapa: false },
];

export function getBares(): Bar[] {
  return _bares;
}

export function getBar(id: string): Bar | undefined {
  return _bares.find(b => b.id === id);
}
