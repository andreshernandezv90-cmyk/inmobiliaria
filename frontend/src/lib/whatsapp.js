import { CONTACT, SITE } from '@/config/site'
import { ROUTES } from '@/config/routes'

/**
 * Construye un enlace de WhatsApp (wa.me) con un mensaje precargado.
 * Funciona en móvil (abre la app) y en escritorio (WhatsApp Web).
 * @param {string} message
 * @param {string} [phone]
 */
export function whatsappUrl(message, phone = CONTACT.whatsapp) {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${text}`
}

/** Mensaje general (botón flotante, header, footer). */
export const generalMessage = () =>
  `Hola, vi su página web de ${SITE.name} y me gustaría recibir información sobre sus propiedades.`

/**
 * Mensaje automático para preguntar por una propiedad concreta.
 * @param {import('@/types/property').Property} property
 */
export function propertyInquiryMessage(property) {
  const link = `${SITE.url}${ROUTES.property(property.slug)}`
  return (
    `Hola, estoy interesado en la propiedad ${property.title} con ID ${property.code} ` +
    `que vi en su página web. ¿Podrían darme más información?\n${link}`
  )
}

export const propertyWhatsappUrl = (property) => whatsappUrl(propertyInquiryMessage(property))
export const generalWhatsappUrl = () => whatsappUrl(generalMessage())
