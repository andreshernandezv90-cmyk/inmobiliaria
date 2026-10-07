/**
 * Utilidades para imágenes responsivas.
 *
 * La API devolverá una `image_url` por fotografía. Según dónde esté alojada
 * generamos variantes de distintos anchos para usar en `srcset`:
 *  - Cloudinary: inserta transformaciones en la URL (w_800,f_auto,q_auto).
 *  - Unsplash (datos de ejemplo): usa parámetros de query.
 *  - Almacenamiento propio: se usa la URL tal cual (el backend podrá generar
 *    miniaturas y exponerlas más adelante).
 */

export const DEFAULT_WIDTHS = [480, 768, 1080, 1440, 1920]

const isCloudinary = (url) => url.includes('res.cloudinary.com') && url.includes('/upload/')
const isUnsplash = (url) => url.includes('images.unsplash.com')

/**
 * Devuelve la URL de la imagen con el ancho indicado.
 * @param {string} url
 * @param {number} width
 */
export function imageAtWidth(url, width) {
  if (!url) return ''
  if (isCloudinary(url)) {
    return url.replace('/upload/', `/upload/w_${width},c_limit,f_auto,q_auto/`)
  }
  if (isUnsplash(url)) {
    const base = url.split('?')[0]
    return `${base}?auto=format&fit=crop&w=${width}&q=72`
  }
  return url
}

/**
 * Genera el atributo `srcset` para una imagen.
 * @param {string} url
 * @param {number[]} widths
 */
export function buildSrcSet(url, widths = DEFAULT_WIDTHS) {
  if (!url || !(isCloudinary(url) || isUnsplash(url))) return undefined
  return widths.map((w) => `${imageAtWidth(url, w)} ${w}w`).join(', ')
}

/** Devuelve la fotografía principal de una propiedad. */
export function mainImage(property) {
  const images = property?.images ?? []
  return images.find((img) => img.is_main) ?? images[0] ?? null
}
