import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import ResponsiveImage from '@/components/ui/ResponsiveImage'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'
import { propertiesUrl } from '@/config/routes'

/**
 * Explorar por zona.
 * Móvil: carrusel horizontal deslizable. Escritorio: composición en rejilla
 * donde la primera zona ocupa el doble de ancho.
 */
export default function ZoneExplorer({ zones = [] }) {
  return (
    <section aria-labelledby="zones-title" className="bg-paper py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="zones-title"
          eyebrow="Zonas"
          title="Explora por zona"
          description="Cada zona tiene su propio ritmo. Encuentra la que mejor va con tu forma de vivir o de invertir."
        />

        <ul className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 scroll-px-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-6">
          {zones.map((zone, index) => (
            <Reveal
              as="li"
              key={zone.slug}
              delay={(index % 3) * 0.08}
              className={`w-[78%] shrink-0 snap-start sm:w-auto ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <ZoneCard zone={zone} wide={index === 0} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ZoneCard({ zone, wide }) {
  const count = zone.available_count ?? 0
  return (
    <Link
      to={propertiesUrl({ city: zone.slug })}
      className="group relative block overflow-hidden rounded-2xl"
      aria-label={`${zone.name}: ${count} ${count === 1 ? 'propiedad disponible' : 'propiedades disponibles'}`}
    >
      <ResponsiveImage
        src={zone.image_url}
        alt=""
        sizes={wide ? '(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 78vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw'}
        widths={[480, 768, 1080, 1440]}
        className={`aspect-[4/5] ${wide ? 'sm:aspect-[16/9]' : 'sm:aspect-[4/3]'} lg:aspect-auto lg:h-[26rem]`}
        imgClassName="transition-transform duration-[1.4s] ease-(--ease-premium) group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-gold-300 uppercase">
            {count} {count === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
          </p>
          <h3 className="mt-2 font-display text-[1.9rem] leading-none font-light text-white sm:text-[2.2rem]">
            {zone.name}
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-snug text-white/75">{zone.description}</p>
        </div>
        <span
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4" strokeWidth={1.8} />
        </span>
      </div>
    </Link>
  )
}
