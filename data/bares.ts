import { Bar } from './types';

// Datos reales de OpenStreetMap (Overpass API) — bares de Alcorcón
const _bares: Bar[] = [
  { id: '587346162',   nombre: 'La Contemporanea',        direccion: '',                       ciudad: 'Alcorcón', lat: 40.3373823, lng: -3.8557310, verificado: false, tieneTapa: false },
  { id: '2463349971',  nombre: "L'Santina",                direccion: '',                       ciudad: 'Alcorcón', lat: 40.3333977, lng: -3.8310620, verificado: false, tieneTapa: false },
  { id: '2973397943',  nombre: 'La posada de Eva',         direccion: '',                       ciudad: 'Alcorcón', lat: 40.3464135, lng: -3.8129904, verificado: false, tieneTapa: false },
  { id: '4195880680',  nombre: 'Bar Restaurante Celedonio',direccion: 'Calle Munich 4',         ciudad: 'Alcorcón', lat: 40.3444783, lng: -3.8154321, verificado: false, tieneTapa: false },
  { id: '4312956895',  nombre: 'Pickup',                   direccion: '',                       ciudad: 'Alcorcón', lat: 40.3381454, lng: -3.8278074, verificado: false, tieneTapa: false },
  { id: '4457745911',  nombre: 'La Barrita',               direccion: '',                       ciudad: 'Alcorcón', lat: 40.3309669, lng: -3.8388144, verificado: false, tieneTapa: false },
  { id: '4457745912',  nombre: 'El Bar de Luis',           direccion: '',                       ciudad: 'Alcorcón', lat: 40.3309278, lng: -3.8379593, verificado: false, tieneTapa: false },
  { id: '4457745913',  nombre: 'Queen',                    direccion: 'Calle Pablo Picasso 3',  ciudad: 'Alcorcón', lat: 40.3305575, lng: -3.8389225, verificado: false, tieneTapa: false },
  { id: '4910957315',  nombre: 'PiKARA',                   direccion: 'Calle Martin Luther King',ciudad: 'Alcorcón', lat: 40.3288530, lng: -3.8337969, verificado: false, tieneTapa: false },
  { id: '4913021889',  nombre: 'Amphora Madrid',           direccion: '',                       ciudad: 'Alcorcón', lat: 40.3447441, lng: -3.8119649, verificado: false, tieneTapa: false },
  { id: '4949014821',  nombre: 'La Traicionera',           direccion: '',                       ciudad: 'Alcorcón', lat: 40.3309686, lng: -3.8394541, verificado: false, tieneTapa: false },
  { id: '6435780630',  nombre: 'Jamon y Pan',              direccion: '',                       ciudad: 'Alcorcón', lat: 40.3404104, lng: -3.8288310, verificado: false, tieneTapa: true  },
  { id: '8398265600',  nombre: "Café-bar Vico's Sandra",   direccion: 'Calle Zamora 7',         ciudad: 'Alcorcón', lat: 40.3430883, lng: -3.8316389, verificado: false, tieneTapa: false },
  { id: '9588578265',  nombre: 'Si, o que',                direccion: 'Calle Martin Luther King',ciudad: 'Alcorcón', lat: 40.3288517, lng: -3.8346106, verificado: false, tieneTapa: false },
  { id: '10704532605', nombre: 'Bar Apolo',                direccion: '',                       ciudad: 'Alcorcón', lat: 40.3559347, lng: -3.8141871, verificado: false, tieneTapa: true  },
  { id: '10913894577', nombre: 'Bacterio Brewing CO',      direccion: '',                       ciudad: 'Alcorcón', lat: 40.3391871, lng: -3.8365597, verificado: false, tieneTapa: false },
  { id: '11248458723', nombre: 'Kiriki Bar',               direccion: '',                       ciudad: 'Alcorcón', lat: 40.3427514, lng: -3.8282381, verificado: false, tieneTapa: false },
  { id: '11435570350', nombre: 'Dublin 98',                direccion: 'Calle Jabonería 59',     ciudad: 'Alcorcón', lat: 40.3494959, lng: -3.8236827, verificado: false, tieneTapa: false },
  { id: '11435666913', nombre: 'Beerseker',                direccion: 'Calle de Polvoranca 66', ciudad: 'Alcorcón', lat: 40.3421531, lng: -3.8200398, verificado: false, tieneTapa: false },
  { id: '11810077436', nombre: 'Calima',                   direccion: '',                       ciudad: 'Alcorcón', lat: 40.3445852, lng: -3.8120965, verificado: false, tieneTapa: false },
  { id: '12121057101', nombre: 'La Tasca',                 direccion: 'Calle Timanfaya',        ciudad: 'Alcorcón', lat: 40.3491189, lng: -3.8096512, verificado: false, tieneTapa: true  },
  { id: '13019334967', nombre: 'Felipe',                   direccion: '',                       ciudad: 'Alcorcón', lat: 40.3512722, lng: -3.8321975, verificado: false, tieneTapa: false },
];

export function getBares(): Bar[] {
  return _bares;
}

export function getBar(id: string): Bar | undefined {
  return _bares.find(b => b.id === id);
}
