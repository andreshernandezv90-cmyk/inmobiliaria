/**
 * Determina si un enlace de navegación corresponde a la URL actual.
 * Considera los query params para distinguir "Propiedades", "Comprar" y "Rentar",
 * que comparten la ruta /propiedades.
 */
export function isNavActive(to, location) {
  const [pathname, query = ''] = to.split('?')
  if (pathname !== location.pathname) return false
  if (pathname === '/') return true

  const target = new URLSearchParams(query)
  const current = new URLSearchParams(location.search)
  const targetOperation = target.get('operation')
  return targetOperation ? current.get('operation') === targetOperation : !current.get('operation')
}
