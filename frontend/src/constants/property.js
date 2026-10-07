/**
 * Catálogos de valores de una propiedad.
 * Las claves (venta, casa, disponible…) son los valores que se guardarán en
 * MySQL y viajarán por la API; las etiquetas son solo para mostrar.
 */

export const OPERATIONS = {
  venta: { label: 'Venta', action: 'Comprar' },
  renta: { label: 'Renta', action: 'Rentar' },
}

export const PROPERTY_TYPES = {
  casa: { label: 'Casa', plural: 'Casas' },
  departamento: { label: 'Departamento', plural: 'Departamentos' },
  terreno: { label: 'Terreno', plural: 'Terrenos' },
  local: { label: 'Local', plural: 'Locales' },
  oficina: { label: 'Oficina', plural: 'Oficinas' },
}

/** Estado comercial (lo administra el propietario desde el panel). */
export const STATUSES = {
  disponible: { label: 'Disponible', public: true },
  apartada: { label: 'Apartada', public: true },
  vendida: { label: 'Vendida', public: true },
  rentada: { label: 'Rentada', public: true },
  oculta: { label: 'Oculta', public: false },
}

/** Etiquetas promocionales opcionales que se muestran sobre la foto. */
export const LABELS = {
  nueva: { label: 'Nueva' },
  destacada: { label: 'Destacada' },
  oportunidad: { label: 'Oportunidad' },
  preventa: { label: 'Preventa' },
}

/** Rangos de precio sugeridos en el buscador, según la operación. */
export const PRICE_RANGES = {
  venta: [
    { label: 'Hasta $3 millones', max: 3_000_000 },
    { label: '$3 – $6 millones', min: 3_000_000, max: 6_000_000 },
    { label: '$6 – $10 millones', min: 6_000_000, max: 10_000_000 },
    { label: 'Más de $10 millones', min: 10_000_000 },
  ],
  renta: [
    { label: 'Hasta $20,000 / mes', max: 20_000 },
    { label: '$20,000 – $40,000 / mes', min: 20_000, max: 40_000 },
    { label: 'Más de $40,000 / mes', min: 40_000 },
  ],
}

export const SORT_OPTIONS = {
  recientes: 'Más recientes',
  precio_asc: 'Menor precio',
  precio_desc: 'Mayor precio',
  tamano_desc: 'Mayor tamaño',
}
