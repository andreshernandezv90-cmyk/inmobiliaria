import { INSTAGRAM_POSTS } from '@/data/instagram'

/**
 * Publicaciones de Instagram.
 * Hoy devuelve ejemplos locales; después podrá consultar un endpoint propio
 * (GET /api/instagram) que cachee las publicaciones del perfil. Si falla,
 * el sitio sigue funcionando: la sección simplemente muestra los ejemplos.
 */
export function getInstagramPosts(limit = 6) {
  return Promise.resolve(INSTAGRAM_POSTS.slice(0, limit))
}
