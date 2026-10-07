/**
 * Definiciones de tipos (JSDoc) del dominio.
 * Reflejan la forma de los datos que devolverá la API de Laravel,
 * por eso usan snake_case igual que las columnas de MySQL.
 *
 * @typedef {'venta' | 'renta'} Operation
 * @typedef {'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'} PropertyType
 * @typedef {'disponible' | 'apartada' | 'vendida' | 'rentada' | 'oculta'} PropertyStatus
 * @typedef {'nueva' | 'destacada' | 'oportunidad' | 'preventa'} PropertyLabel
 *
 * @typedef {Object} PropertyImage
 * @property {number} id
 * @property {string} image_url   URL pública (Cloudinary o almacenamiento del servidor)
 * @property {string} alt
 * @property {boolean} is_main
 * @property {number} position
 *
 * @typedef {Object} Property
 * @property {number} id
 * @property {string} code              ID interno visible, p. ej. "PROP-004"
 * @property {string} title
 * @property {string} slug
 * @property {string} short_description
 * @property {string} description
 * @property {number} price
 * @property {Operation} operation
 * @property {PropertyType} property_type
 * @property {PropertyStatus} status
 * @property {PropertyLabel | null} label
 * @property {string} city
 * @property {string} city_slug
 * @property {string} zone
 * @property {string} state
 * @property {string} address           No se muestra públicamente
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} bedrooms
 * @property {number} bathrooms
 * @property {number} parking_spaces
 * @property {number | null} construction_m2
 * @property {number | null} land_m2
 * @property {string[]} amenities       Claves del catálogo de amenidades
 * @property {PropertyImage[]} images
 * @property {boolean} featured
 * @property {string} published_at      Fecha ISO
 *
 * @typedef {Object} Zone
 * @property {string} slug
 * @property {string} name
 * @property {string} description
 * @property {string} image_url
 * @property {number} [available_count]
 */

export {}
