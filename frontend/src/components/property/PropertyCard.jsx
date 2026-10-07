import { Link } from 'react-router'
import { ArrowUpRight, MapPin } from 'lucide-react'
import ResponsiveImage from '@/components/ui/ResponsiveImage'
import FavoriteButton from './FavoriteButton'
import PropertyBadge from './PropertyBadge'
import PropertyFeatures from './PropertyFeatures'
import PriceDisplay from './PriceDisplay'
import { ROUTES } from '@/config/routes'
import { mainImage } from '@/lib/images'
import { labelText, operationLabel, propertyTypeLabel, statusLabel } from '@/lib/format'

/**
 * Tarjeta de propiedad estilo catálogo: la fotografía es protagonista y
 * toda la tarjeta es un enlace a la ficha completa.
 *
 * @param {{ property: import('@/types/property').Property, sizes?: string, priority?: boolean }} props
 */
export default function PropertyCard({
  property,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
}) {
  const image = mainImage(property)
  const unavailable = property.status !== 'disponible'
  const href = ROUTES.property(property.slug)
  const titleId = `property-${property.id}-title`

  return (
    <article
      className="group relative rounded-2xl has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-gold-600"
      aria-labelledby={titleId}
    >
      <div className="relative">
        <ResponsiveImage
          src={image?.image_url}
          alt={image?.alt ?? property.title}
          sizes={sizes}
          widths={[480, 768, 1080]}
          fallbackWidth={768}
          priority={priority}
          className="aspect-[4/3] rounded-2xl"
          imgClassName="transition-transform duration-[1.2s] ease-(--ease-premium) group-hover:scale-[1.04]"
        />

        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <PropertyBadge tone="dark">{operationLabel(property.operation)}</PropertyBadge>
            {unavailable ? (
              <PropertyBadge>{statusLabel(property.status)}</PropertyBadge>
            ) : (
              property.label && (
                <PropertyBadge tone={property.label === 'destacada' ? 'gold' : 'default'}>
                  {labelText(property.label)}
                </PropertyBadge>
              )
            )}
          </div>
          <FavoriteButton propertyId={property.id} title={property.title} className="pointer-events-auto" />
        </div>
      </div>

      <div className="pt-4">
        <p className="flex items-center gap-1.5 text-[0.78rem] font-medium text-muted">
          <span className="font-semibold tracking-[0.12em] text-gold-600 uppercase">
            {propertyTypeLabel(property.property_type)}
          </span>
          <span aria-hidden="true">·</span>
          <MapPin className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
          <span className="truncate">
            {property.zone}, {property.city}
          </span>
        </p>

        <h3 id={titleId} className="mt-2 text-[1.05rem] leading-snug font-semibold text-ink">
          <Link to={href} className="after:absolute after:inset-0 after:z-0 after:rounded-2xl focus-visible:outline-none">
            {property.title}
          </Link>
        </h3>

        <PropertyFeatures property={property} className="mt-3" />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
          <PriceDisplay price={property.price} operation={property.operation} />
          <span className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-ink" aria-hidden="true">
            Ver propiedad
            <span className="inline-flex size-8 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
              <ArrowUpRight className="size-4" strokeWidth={1.8} />
            </span>
          </span>
        </div>
      </div>
    </article>
  )
}
