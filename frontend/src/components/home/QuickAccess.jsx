import { Link } from 'react-router'
import { ArrowRight, Building2, House, KeyRound, LandPlot, Handshake } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'
import { propertiesUrl } from '@/config/routes'

const ITEMS = [
  { key: 'venta', label: 'Comprar', icon: Handshake, filters: { operation: 'venta' } },
  { key: 'renta', label: 'Rentar', icon: KeyRound, filters: { operation: 'renta' } },
  { key: 'casa', label: 'Casas', icon: House, filters: { property_type: 'casa' } },
  { key: 'departamento', label: 'Departamentos', icon: Building2, filters: { property_type: 'departamento' } },
  { key: 'terreno', label: 'Terrenos', icon: LandPlot, filters: { property_type: 'terreno' } },
]

/** Accesos rápidos al catálogo con el número de propiedades de cada categoría. */
export default function QuickAccess({ summary }) {
  return (
    <section aria-label="Accesos rápidos" className="border-b border-line bg-paper">
      <div className="container-page">
        <Reveal
          as="ul"
          className="scrollbar-none -mx-5 flex snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0"
        >
          {ITEMS.map(({ key, label, icon: Icon, filters }) => {
            const count = summary?.[key]
            return (
              <li
                key={key}
                className="shrink-0 snap-start border-line not-last:border-r lg:border-r lg:first:border-l"
              >
                <Link
                  to={propertiesUrl(filters)}
                  className="group flex h-full min-w-44 items-center gap-4 py-6 pr-6 pl-1 transition-colors lg:px-6 lg:py-8 lg:hover:bg-sand-100/60"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-sand-100 text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-ivory">
                    <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[0.95rem] font-semibold text-ink">{label}</span>
                    <span className="block text-xs text-muted">
                      {count === undefined ? ' ' : `${count} ${count === 1 ? 'propiedad' : 'propiedades'}`}
                    </span>
                  </span>
                  <ArrowRight
                    className="hidden size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink lg:block"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
