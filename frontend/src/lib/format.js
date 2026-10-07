import { SITE } from '@/config/site'
import { OPERATIONS, PROPERTY_TYPES, STATUSES, LABELS } from '@/constants/property'

const currencyFormatter = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat(SITE.locale, { maximumFractionDigits: 1 })

/** 3250000 → "$3,250,000" */
export const formatPrice = (value) => currencyFormatter.format(value)

/** 4.5 → "4.5", 1200 → "1,200" */
export const formatNumber = (value) => numberFormatter.format(value)

/** Sufijo según la operación: renta se cobra por mes. */
export const priceSuffix = (operation) => (operation === 'renta' ? '/ mes' : '')

export const operationLabel = (key) => OPERATIONS[key]?.label ?? key
export const propertyTypeLabel = (key) => PROPERTY_TYPES[key]?.label ?? key
export const statusLabel = (key) => STATUSES[key]?.label ?? key
export const labelText = (key) => LABELS[key]?.label ?? key

/** "Zona Providencia, Guadalajara, Jalisco" — ubicación pública aproximada. */
export const publicLocation = ({ zone, city, state }) =>
  [zone && `Zona ${zone}`, city, state].filter(Boolean).join(', ')

/** Pluraliza de forma sencilla: (3, 'recámara') → "3 recámaras" */
export const plural = (count, singular, pluralForm = `${singular}s`) =>
  `${formatNumber(count)} ${count === 1 ? singular : pluralForm}`
