import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'

/**
 * Encabezado estándar de sección: texto superior, título, descripción
 * y un enlace opcional alineado a la derecha en escritorio.
 */
export default function SectionHeading({ eyebrow, title, description, action, id, tone = 'dark' }) {
  const isLight = tone === 'light'
  return (
    <Reveal className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className={`eyebrow mb-4 ${isLight ? 'text-gold-300!' : ''}`}>{eyebrow}</p>}
        <h2
          id={id}
          className={`heading-display text-[2.1rem] leading-[1.08] sm:text-5xl ${isLight ? 'text-ivory' : 'text-ink'}`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-4 max-w-xl text-base leading-relaxed ${isLight ? 'text-ivory/70' : 'text-muted'}`}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          className={`group inline-flex shrink-0 items-center gap-2 text-sm font-semibold ${isLight ? 'text-ivory' : 'text-ink'}`}
        >
          <span className="border-b border-current/30 pb-0.5 transition-colors group-hover:border-current">
            {action.label}
          </span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </Reveal>
  )
}
