/**
 * Rutas públicas del sitio. Centralizarlas evita escribir URLs "a mano"
 * en los componentes y facilita cambiarlas en el futuro.
 */
export const ROUTES = {
  home: '/',
  properties: '/propiedades',
  property: (slug) => `/propiedad/${slug}`,
  map: '/mapa',
  favorites: '/favoritos',
  sell: '/vende-tu-propiedad',
  contact: '/contacto',
  privacy: '/aviso-de-privacidad',
  admin: '/admin',
}

/**
 * Construye la URL del catálogo con filtros como query params.
 * Los nombres coinciden con los que aceptará la API: /api/properties?operation=venta…
 * @param {Record<string, string | number | undefined | null>} filters
 */
export function propertiesUrl(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  })
  const query = params.toString()
  return query ? `${ROUTES.properties}?${query}` : ROUTES.properties
}
