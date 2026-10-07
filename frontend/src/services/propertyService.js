import { PROPERTIES } from '@/data/properties'
import { ZONES } from '@/data/zones'
import { filterProperties } from '@/lib/filterProperties'

/**
 * Capa de acceso a datos de propiedades.
 *
 * Etapa 1: responde con datos locales (src/data).
 * Etapa backend: cada función se reemplazará por una llamada a la API, p. ej.
 *   getProperties(filters) → http.get('/properties', { params: filters })
 * Los componentes y hooks no tendrán que cambiar.
 */

/** Simula la latencia de red para que los estados de carga sean realistas. */
const delay = (data, ms = 150) => new Promise((resolve) => setTimeout(() => resolve(data), ms))

/** GET /api/properties?… */
export function getProperties(filters = {}) {
  return delay(filterProperties(PROPERTIES, filters))
}

/** GET /api/properties/featured */
export function getFeaturedProperties(limit = 6) {
  return delay(filterProperties(PROPERTIES, { featured: true }).slice(0, limit))
}

/** GET /api/properties/{slug} */
export function getPropertyBySlug(slug) {
  return delay(PROPERTIES.find((p) => p.slug === slug) ?? null)
}

/** GET /api/zones — incluye cuántas propiedades disponibles hay en cada zona. */
export function getZones() {
  const available = filterProperties(PROPERTIES, {}).filter((p) => p.status === 'disponible')
  return delay(
    ZONES.map((zone) => ({
      ...zone,
      available_count: available.filter((p) => p.city_slug === zone.slug).length,
    })),
  )
}

/** Conteos para los accesos rápidos (Comprar, Rentar, Casas…). */
export function getCatalogSummary() {
  const visible = filterProperties(PROPERTIES, {})
  const count = (predicate) => visible.filter(predicate).length
  return delay({
    venta: count((p) => p.operation === 'venta'),
    renta: count((p) => p.operation === 'renta'),
    casa: count((p) => p.property_type === 'casa'),
    departamento: count((p) => p.property_type === 'departamento'),
    terreno: count((p) => p.property_type === 'terreno'),
    local: count((p) => p.property_type === 'local'),
    oficina: count((p) => p.property_type === 'oficina'),
  })
}
