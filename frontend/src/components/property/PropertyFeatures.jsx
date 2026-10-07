import { Bath, BedDouble, Car, LandPlot, Ruler } from 'lucide-react'
import { formatNumber } from '@/lib/format'

/**
 * Lista de características principales con íconos.
 * Solo muestra los datos que aplican (un terreno no tiene recámaras).
 * `variant="compact"` para tarjetas, `"detailed"` para la ficha de propiedad.
 */
export default function PropertyFeatures({ property, variant = 'compact', className = '' }) {
  const { bedrooms, bathrooms, parking_spaces, construction_m2, land_m2 } = property
  const detailed = variant === 'detailed'

  const items = [
    bedrooms > 0 && { icon: BedDouble, value: bedrooms, short: 'rec.', long: bedrooms === 1 ? 'recámara' : 'recámaras' },
    bathrooms > 0 && { icon: Bath, value: bathrooms, short: bathrooms === 1 ? 'baño' : 'baños', long: bathrooms === 1 ? 'baño' : 'baños' },
    parking_spaces > 0 && {
      icon: Car,
      value: parking_spaces,
      short: 'est.',
      long: parking_spaces === 1 ? 'estacionamiento' : 'estacionamientos',
    },
    construction_m2 && { icon: Ruler, value: construction_m2, short: 'm²', long: 'm² construcción' },
    (detailed || !construction_m2) && land_m2 && { icon: LandPlot, value: land_m2, short: 'm²', long: 'm² terreno' },
  ].filter(Boolean)

  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.82rem] text-ink-soft ${className}`}>
      {items.map(({ icon: Icon, value, short, long }) => (
        <li key={long} className="inline-flex items-center gap-1.5">
          <Icon className="size-4 text-muted" strokeWidth={1.6} aria-hidden="true" />
          <span>
            <span className="font-semibold text-ink">{formatNumber(value)}</span>{' '}
            {detailed ? long : <span aria-hidden="true">{short}</span>}
            {!detailed && <span className="sr-only">{long}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}
