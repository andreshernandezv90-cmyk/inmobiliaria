/**
 * Zonas (municipios) destacadas de la zona metropolitana de Guadalajara.
 * `slug` coincide con `city_slug` de las propiedades para poder contar
 * cuántas hay disponibles en cada una.
 * Fotografías de Unsplash solo para demostración.
 */

/** @type {import('@/types/property').Zone[]} */
export const ZONES = [
  {
    slug: 'zapopan',
    name: 'Zapopan',
    description: 'Cotos residenciales, corporativos y la mejor oferta comercial.',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  },
  {
    slug: 'guadalajara',
    name: 'Guadalajara',
    description: 'Colonias con historia, vida de barrio y departamentos caminables.',
    image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
  },
  {
    slug: 'tlaquepaque',
    name: 'Tlaquepaque',
    description: 'Casonas, arte y un centro lleno de vida.',
    image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
  },
  {
    slug: 'tlajomulco',
    name: 'Tlajomulco',
    description: 'Terrenos y fraccionamientos con espacio para crecer.',
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
  },
  {
    slug: 'tonala',
    name: 'Tonalá',
    description: 'Desarrollos nuevos con precios accesibles.',
    image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
  },
]
