import { ROUTES, propertiesUrl } from './routes'

/** Navegación principal (header y menú móvil). */
export const MAIN_NAV = [
  { label: 'Inicio', to: ROUTES.home },
  { label: 'Propiedades', to: ROUTES.properties },
  { label: 'Comprar', to: propertiesUrl({ operation: 'venta' }) },
  { label: 'Rentar', to: propertiesUrl({ operation: 'renta' }) },
  { label: 'Vende tu propiedad', to: ROUTES.sell },
  { label: 'Contacto', to: ROUTES.contact },
]

/** Columnas de enlaces del footer. */
export const FOOTER_NAV = [
  {
    title: 'Explorar',
    links: [
      { label: 'Propiedades', to: ROUTES.properties },
      { label: 'Comprar', to: propertiesUrl({ operation: 'venta' }) },
      { label: 'Rentar', to: propertiesUrl({ operation: 'renta' }) },
      { label: 'Favoritos', to: ROUTES.favorites },
    ],
  },
  {
    title: 'Inmobiliaria',
    links: [
      { label: 'Vende tu propiedad', to: ROUTES.sell },
      { label: 'Contacto', to: ROUTES.contact },
      { label: 'Aviso de privacidad', to: ROUTES.privacy },
    ],
  },
]
