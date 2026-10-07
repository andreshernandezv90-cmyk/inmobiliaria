import { Link } from 'react-router'
import { SITE } from '@/config/site'
import { ROUTES } from '@/config/routes'

/**
 * Logotipo: un arco (el "umbral" de una puerta) + nombre en serif.
 * `tone="light"` para usarlo sobre fotografías o fondos oscuros.
 */
export default function Logo({ tone = 'dark', className = '' }) {
  const light = tone === 'light'
  return (
    <Link
      to={ROUTES.home}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${SITE.name}, ir al inicio`}
    >
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <path
          d="M9 25V14a7 7 0 0 1 14 0v11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={light ? 'text-gold-300' : 'text-gold-600'}
        />
        <path
          d="M5 25h22"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={light ? 'text-white' : 'text-ink'}
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.45rem] font-normal tracking-[-0.01em] ${light ? 'text-white' : 'text-ink'}`}
        >
          {SITE.name}
        </span>
        <span
          className={`mt-1 text-[0.58rem] font-semibold tracking-[0.3em] whitespace-nowrap uppercase ${light ? 'text-white/70' : 'text-muted'}`}
        >
          {SITE.tagline}
        </span>
      </span>
    </Link>
  )
}
