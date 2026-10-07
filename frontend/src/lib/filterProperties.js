import { STATUSES } from '@/constants/property'

/**
 * Filtra y ordena propiedades en memoria.
 * Recibe los mismos parámetros que aceptará GET /api/properties, así que
 * sirve como especificación de la lógica que implementará Laravel.
 *
 * @param {import('@/types/property').Property[]} properties
 * @param {Object} filters
 * @param {string} [filters.operation]      venta | renta
 * @param {string} [filters.property_type]  casa | departamento | …
 * @param {string} [filters.city]           slug de ciudad
 * @param {string} [filters.zone]
 * @param {number|string} [filters.min_price]
 * @param {number|string} [filters.max_price]
 * @param {number|string} [filters.bedrooms]   mínimo de recámaras
 * @param {number|string} [filters.bathrooms]  mínimo de baños
 * @param {boolean} [filters.featured]
 * @param {string} [filters.sort]           recientes | precio_asc | precio_desc | tamano_desc
 */
export function filterProperties(properties, filters = {}) {
  const num = (v) => (v === undefined || v === null || v === '' ? null : Number(v))
  const minPrice = num(filters.min_price)
  const maxPrice = num(filters.max_price)
  const bedrooms = num(filters.bedrooms)
  const bathrooms = num(filters.bathrooms)
  const zone = filters.zone?.toLowerCase()

  const result = properties.filter((p) => {
    if (!STATUSES[p.status]?.public) return false
    if (filters.operation && p.operation !== filters.operation) return false
    if (filters.property_type && p.property_type !== filters.property_type) return false
    if (filters.city && p.city_slug !== filters.city) return false
    if (zone && p.zone.toLowerCase() !== zone) return false
    if (minPrice !== null && p.price < minPrice) return false
    if (maxPrice !== null && p.price > maxPrice) return false
    if (bedrooms !== null && p.bedrooms < bedrooms) return false
    if (bathrooms !== null && p.bathrooms < bathrooms) return false
    if (filters.featured && !p.featured) return false
    return true
  })

  const size = (p) => p.construction_m2 ?? p.land_m2 ?? 0
  const sorters = {
    recientes: (a, b) => b.published_at.localeCompare(a.published_at),
    precio_asc: (a, b) => a.price - b.price,
    precio_desc: (a, b) => b.price - a.price,
    tamano_desc: (a, b) => size(b) - size(a),
  }

  return result.sort(sorters[filters.sort] ?? sorters.recientes)
}
