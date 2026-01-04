// Datos de locales del Centro Comercial Puente de San Gil
const stores = [
  {
    id: 1,
    nombre: 'Restaurante La Toscana',
    categoria: 'restaurante',
    telefono: '+57 311 234 5678',
    ubicacion: 'Local 101, Piso 1',
    cocina: 'italiana',
    horario: {
      lunes_viernes: '12:00 - 22:00',
      sabado: '12:00 - 23:00',
      domingo: '12:00 - 21:00'
    },
    keywords: ['italiana', 'pasta', 'pizza', 'toscana']
  },
  {
    id: 2,
    nombre: 'Nike Store',
    categoria: 'ropa',
    telefono: '+57 312 345 6789',
    ubicacion: 'Local 205, Piso 2',
    tipo: 'deportiva',
    horario: {
      lunes_sabado: '10:00 - 21:00',
      domingo: '11:00 - 20:00'
    },
    keywords: ['nike', 'deportes', 'ropa', 'zapatillas', 'tenis']
  },
  {
    id: 3,
    nombre: 'Cinemark',
    categoria: 'entretenimiento',
    telefono: '+57 313 456 7890',
    ubicacion: 'Local 301, Piso 3',
    tipo: 'cine',
    horario: {
      todos_los_dias: '10:00 - 23:00'
    },
    keywords: ['cine', 'peliculas', 'cinemark', 'entretenimiento']
  },
  {
    id: 4,
    nombre: 'Subway',
    categoria: 'comida_rapida',
    telefono: '+57 314 567 8901',
    ubicacion: 'Local 102, Piso 1',
    tipo: 'sandwiches',
    horario: {
      todos_los_dias: '08:00 - 22:00'
    },
    keywords: ['subway', 'sandwiches', 'comida rapida', 'saludable']
  },
  {
    id: 5,
    nombre: 'Banco Davivienda',
    categoria: 'servicios',
    telefono: '+57 315 678 9012',
    ubicacion: 'Local 150, Piso 1',
    tipo: 'banco',
    horario: {
      lunes_viernes: '08:00 - 17:00',
      sabado: '09:00 - 13:00',
      domingo: 'Cerrado'
    },
    keywords: ['banco', 'davivienda', 'cajero', 'dinero', 'cuenta']
  }
];

module.exports = stores;