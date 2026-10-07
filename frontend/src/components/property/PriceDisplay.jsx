import { SITE } from '@/config/site'
import { formatPrice, priceSuffix } from '@/lib/format'

/** Precio con moneda y, en rentas, el periodo ("/ mes"). */
export default function PriceDisplay({ price, operation, size = 'md', className = '' }) {
  const sizes = {
    md: 'text-[1.35rem]',
    lg: 'text-3xl sm:text-4xl',
  }
  const suffix = priceSuffix(operation)
  return (
    <p className={`flex flex-wrap items-baseline gap-x-1.5 ${className}`}>
      <span className={`font-display font-normal tracking-[-0.01em] text-ink ${sizes[size]}`}>{formatPrice(price)}</span>
      <span className="text-xs font-semibold tracking-wide text-muted">
        {SITE.currency}
        {suffix && ` ${suffix}`}
      </span>
    </p>
  )
}
