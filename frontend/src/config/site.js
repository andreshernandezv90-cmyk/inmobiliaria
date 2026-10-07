/**
 * Configuración general del sitio.
 * Todo lo que el propietario podría querer cambiar (nombre, teléfonos,
 * redes sociales) vive aquí para no tener que buscarlo en los componentes.
 */
export const SITE = {
  name: 'Umbral',
  tagline: 'Bienes raíces',
  description:
    'Casas, departamentos, terrenos, locales y oficinas en venta y renta en Guadalajara, Zapopan y la zona metropolitana.',
  url: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  locale: 'es-MX',
  currency: 'MXN',
  region: 'Guadalajara, Jalisco',
}

export const CONTACT = {
  // Formato internacional sin "+" (52 = México). Se puede sobrescribir con .env
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '5213300000000',
  phone: '33 0000 0000',
  phoneHref: 'tel:+523300000000',
  email: 'hola@umbral.mx',
  schedule: [
    { days: 'Lunes a viernes', hours: '9:00 – 19:00' },
    { days: 'Sábado', hours: '10:00 – 14:00' },
  ],
}

export const SOCIAL = {
  instagram: {
    handle: '@umbral.inmobiliaria',
    url: 'https://www.instagram.com/umbral.inmobiliaria',
  },
  facebook: {
    url: 'https://www.facebook.com/umbral.inmobiliaria',
  },
}
